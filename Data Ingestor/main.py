from flask import Flask
from flask_restful import Api, Resource, reqparse
from sqlalchemy import JSON
from Nexrad_video import get_animation
# from Nexrad_plot import get_plot_base64
from Nexrad_image import get_image
import json

app = Flask(__name__)
api = Api(app)



video_req = reqparse.RequestParser()
video_req.add_argument("station", type=str, help="Station Code", required=True)
video_req.add_argument("year", type=int, help="Year", required=True)
video_req.add_argument("month", type=int, help="Month", required=True)
video_req.add_argument("date", type=int, help="Date", required=True)
video_req.add_argument("hour", type=int, help="Hour", required=True)

# establish connection with rabbitmq server 

import pika  

def postPlot(req):
    try:
        print("got==", req)
        # json_object = json.loads(req)
        # print("=======",json_object)
        # args = req.parse_args()
        station, year, month, date, hour = req["station"], req["year"], req["month"], req["date"], req["hour"]
        print("values : ", type(station), type(year), type(month), type(date), type(hour))

        # res = get_animation(station, year, month, date, hour)
        # res = get_plot_base64(year, month, date, station)
        # res = get_plot_base64("2021", "01", "01", "KIND")
        
        res = get_image(station, year, month, date, hour)
        
        # res = None
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
    
def postVideo(req):
    try:
        station, year, month, date, hour = req["station"], req["year"], req["month"], req["date"], req["hour"]        
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


connection = pika.BlockingConnection(pika.ConnectionParameters('127.0.0.1'))
channel = connection.channel()
print(" Connected to RBmq server")

#create/ declare queue
channel.queue_declare(queue='makeplot')

def callback(channel, method, properties, body):
    print("body==",body, type(body))
    body_string=body.decode('utf8')
    print("before converting to json : ", body_string)
    json_body = json.loads(body_string)
    if(json_body["video"]):
        plot_resp = postPlot(json_body)
    else:
        plot_resp = postVideo(json_body)    
    y = json.dumps(plot_resp)
    channel.basic_publish(exchange='', routing_key="makeplot_r", properties=pika.BasicProperties(content_type='application/json', delivery_mode=1), body=y)

channel.basic_consume(queue='makeplot', on_message_callback=callback, auto_ack=True)

print(" [x] Awaiting RPC requests")
channel.start_consuming()        

channel.close()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5678)
