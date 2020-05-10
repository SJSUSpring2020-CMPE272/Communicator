from flask import Flask,request, jsonify, json
from flask_cors import CORS
import json

app = Flask(__name__)

CORS(app)

import numpy as np
import tensorflow as tf
import cv2
from keras.models import model_from_json

# Loading the model
model_file = open("model-bw.json", "r")
model = model_file.read()
model_file.close()
model = model_from_json(model)
# load weights into new model
model.load_weights("model-bw.h5") 

def from_base64(base64_data):
    nparr = np.fromstring(base64_data.decode('base64'), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_ANYCOLOR)

def get_threshed_image(cv_image):
    x1 = int(0.6*cv_image.shape[1])
    y1 = 20
    x2 = cv_image.shape[1]-20
    y2 = int(0.5*cv_image.shape[1])

    roi = cv_image[y1:y2, x1:x2]
    roi = cv2.resize(roi, (64, 64)) 

    roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    cv2.imwrite('grey.jpg', roi)
    _, roi = cv2.threshold(roi, 120, 255, cv2.THRESH_BINARY)
    return roi

def predict_result(threshed_image):
    # # Loading the model
    # model_file = open("model-bw.json", "r")
    # model = model_file.read()
    # model_file.close()
    # model = model_from_json(model)
    # # load weights into new model
    model.load_weights("model-bw.h5") 
    cv2.imwrite('thresh.jpg', threshed_image)
    result = model.predict_classes(threshed_image.reshape(1, 64, 64, 1))[0]
    result1 = model.predict_proba(threshed_image.reshape(1, 64, 64, 1))[0]
    print('\nPredict Fuction Output:', result1)
    with open('classes.txt') as json_file:
        classes = json.load(json_file)
        listOfItems = classes.items()
        for item  in listOfItems:
            if item[1]==result:
                return item[0]
    return result

@app.route('/predict',methods=['GET', 'POST', 'DELETE', 'PUT'])
def predict():
    if request.method == 'GET':
        return jsonify({"error":"Yes"})
    elif request.method == 'POST':
        print(request)
        request_data=request.get_json()
        image_txt=request_data["image_txt"]
        image_txt=image_txt.split(",")[1]
        cv_image = from_base64(image_txt)
        threshed_image = get_threshed_image(cv_image)
        result= predict_result(threshed_image)
        print(result)
        response=app.response_class(
            response=json.dumps(result),
            status=200,
            mimetype='application/json'
        )
        return response

@app.route('/')
def isAppup():
    return "Application is up"

if __name__ == '__main__':
  app.run(host='0.0.0.0',port=80,debug = True)