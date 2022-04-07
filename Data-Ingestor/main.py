from flask import Flask
from flask_restful import Api, Resource, reqparse

from Nexrad_video import get_animation
# from Nexrad_plot import get_plot_base64
from Nexrad_image import get_image, get_image_M2


app = Flask(__name__)
api = Api(app)

plot_req = reqparse.RequestParser()
plot_req.add_argument("station", type=str, help="Station Code", required=True)
plot_req.add_argument("year", type=int, help="Year", required=True)
plot_req.add_argument("month", type=int, help="Month", required=True)
plot_req.add_argument("date", type=int, help="Date", required=True)
plot_req.add_argument("hour", type=int, help="Hour", required=True)
plot_req.add_argument("dataset", type=int, help="dataset", required=True)

video_req = reqparse.RequestParser()
video_req.add_argument("station", type=str, help="Station Code", required=True)
video_req.add_argument("year", type=int, help="Year", required=True)
video_req.add_argument("month", type=int, help="Month", required=True)
video_req.add_argument("date", type=int, help="Date", required=True)
video_req.add_argument("hour", type=int, help="Hour", required=True)

class NEXRAD_Plot(Resource):
    def post(self):
        try:
            args = plot_req.parse_args()
            station, year, month, date, hour, dataset = args["station"], args["year"], args["month"], args["date"], args["hour"], args["dataset"]
            
            if dataset == 1:
                res = get_image(station, year, month, date, hour)
            elif dataset == 2:
                res = get_image_M2(station, year, month, date)
            else:
                return {
                "resp": "Send Valid DataSet!",
                "status" : "Error"
                }
            
            if not res:
                return {
                "resp": "No Data Found!",
                "status" : "NO"
                }
            
            return {
                "resp": res,
                "status" : "success"
                }
        except BaseException as error:
            print(error)
            err_str = "Error : " + str(error)
            return {
                "resp": err_str,
                "status" : "Error"
                }
    

class NEXRAD_Video(Resource):
    def post(self):
        try:
            args = video_req.parse_args()
            station, year, month, date, hour = args["station"], args["year"], args["month"], args["date"], args["hour"]
            
            res = get_animation(station, year, month, date, hour)
            
            if not res:
                return {
                "resp": "No Data Found!",
                "status" : "success"
                }
            
            return {
                "resp": res,
                "status" : "success"
                }
        except BaseException as error:
            print(error)
            err_str = "errro is : " + str(error)
            return {
                "resp": err_str,
                "status" : "Error"
                }
    

class IsWorking(Resource):
    def get(self):
        return {"message": "New NEXRAD API Working!!!"}
        

api.add_resource(IsWorking, "/isworking")
api.add_resource(NEXRAD_Plot, "/get-plot")
api.add_resource(NEXRAD_Video, "/get-video")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5678)
