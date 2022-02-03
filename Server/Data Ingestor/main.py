from flask import Flask
from flask_restful import Api, Resource, reqparse

from Nexrad_video import get_animation
from Nexrad_plot import get_plot_base64


app = Flask(__name__)
api = Api(app)

plot_req = reqparse.RequestParser()
plot_req.add_argument("station", type=str, help="Station Code", required=True)
plot_req.add_argument("year", type=int, help="Year", required=True)
plot_req.add_argument("month", type=int, help="Month", required=True)
plot_req.add_argument("date", type=int, help="Date", required=True)
plot_req.add_argument("hour", type=int, help="Hour", required=True)

class NEXRAD_Analysis(Resource):
    def post(self):
        args = plot_req.parse_args()
        station, year, month, date, hour = args["station"], args["year"], args["month"], args["date"], args["hour"]
        
        # res = get_animation('KIND', 2021, 1, 1, 15)
        
        # res = get_animation(station, year, month, date, hour)
        res = get_plot_base64("2021", "01", "01", "KIND")
        
        return {
            "resp": res,
            "status" : ""
            }
    
class IsWorking(Resource):
    def get(self):
        return {"message": "New NEXRAD API Working!!!"}
        
    
    
api.add_resource(IsWorking, "/isworking")
api.add_resource(NEXRAD_Analysis, "/getPlot")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5678)
