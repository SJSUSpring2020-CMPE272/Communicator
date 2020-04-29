import numpy as np
import os
import cv2

take_train_samples=10
take_test_samples=7
trainWords=["Hello","How","Are","You","I","Good","Beautiful","Love","Weather","Nice","Day","Thanks","Am","Working","Training"]

if not os.path.exists("dataset"):
    os.makedirs("dataset")
if not os.path.exists("dataset/training_labeled_data"):
    os.makedirs("dataset/training_labeled_data")
if not os.path.exists("dataset/testing_labeled_data"):
    os.makedirs("dataset/testing_labeled_data")
for word in trainWords:
    if not os.path.exists("dataset/training_labeled_data/"+word):
        os.makedirs("dataset/training_labeled_data/"+word)
    if not os.path.exists("dataset/testing_labeled_data/"+word):
        os.makedirs("dataset/testing_labeled_data/"+word)

cap = cv2.VideoCapture(0)
currentIndex=0
takingSamplesForWord=trainWords[currentIndex]
current_train_samples_count=len(os.listdir("dataset/training_labeled_data/"+takingSamplesForWord))
current_test_samples_count=len(os.listdir("dataset/testing_labeled_data/"+takingSamplesForWord))

while current_train_samples_count>=take_train_samples and  current_test_samples_count>=take_test_samples:
    currentIndex=currentIndex+1
    takingSamplesForWord=trainWords[currentIndex]
    current_train_samples_count=len(os.listdir("dataset/training_labeled_data/"+takingSamplesForWord))
    current_test_samples_count=len(os.listdir("dataset/testing_labeled_data/"+takingSamplesForWord))

mode="train"
if current_train_samples_count>=take_train_samples:
    mode="test"

while True:
    _,rawFrame=cap.read()
    flippedFrame=cv2.flip(rawFrame,1)

    cv2.putText(flippedFrame, "Word : "+takingSamplesForWord, (10, 50), cv2.FONT_HERSHEY_PLAIN, 1, (0,255,255), 1)
    cv2.putText(flippedFrame, "Mode : "+mode, (10, 80), cv2.FONT_HERSHEY_PLAIN, 1, (0,255,255), 1)
    cv2.putText(flippedFrame, "Train Set Count : "+str(current_train_samples_count), (10, 110), cv2.FONT_HERSHEY_PLAIN, 1, (0,255,255), 1)
    cv2.putText(flippedFrame, "Test Set Count : "+str(current_test_samples_count), (10, 140), cv2.FONT_HERSHEY_PLAIN, 1, (0,255,255), 1)

    # Coordinates of the ROI
    x1 = int(0.5*flippedFrame.shape[1])
    y1 = 10
    x2 = flippedFrame.shape[1]-10
    y2 = int(0.5*flippedFrame.shape[1])
    # Drawing the ROI
    # The increment/decrement by 1 is to compensate for the bounding box
    cv2.rectangle(flippedFrame, (x1-1, y1-1), (x2+1, y2+1), (255,0,0) ,1)
    # Extracting the ROI
    roi = flippedFrame[y1:y2, x1:x2]
    roi = cv2.resize(roi, (64, 64)) 
 
    cv2.imshow("Frame", flippedFrame)
    
    roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    _, roi = cv2.threshold(roi, 120, 255, cv2.THRESH_BINARY)
    cv2.imshow("ROI", roi)

    interrupt = cv2.waitKey(10)
    if interrupt & 0xFF == 27: # esc key
        break
    if interrupt & 0xFF == ord('0'):
        count=0
        if mode=="train":
            count=current_train_samples_count
        else:
            count=current_test_samples_count

        cv2.imwrite("dataset/"+mode+"ing_labeled_data/"+takingSamplesForWord+"/"+str(count)+'.jpg', roi)
        if mode=="train":
            current_train_samples_count=current_train_samples_count+1
            if current_train_samples_count>=take_train_samples and current_test_samples_count<take_test_samples:
                mode="test"
            else:
                while current_train_samples_count>=take_train_samples and  current_test_samples_count>=take_test_samples:
                    currentIndex=currentIndex+1
                    takingSamplesForWord=trainWords[currentIndex]
                    current_train_samples_count=len(os.listdir("dataset/training_labeled_data/"+takingSamplesForWord))
                    current_test_samples_count=len(os.listdir("dataset/testing_labeled_data/"+takingSamplesForWord))
                mode="train"
                if current_train_samples_count>=take_train_samples:
                    mode="test"
                
        else:
            current_test_samples_count=current_test_samples_count+1
            while current_train_samples_count>=take_train_samples and  current_test_samples_count>=take_test_samples:
                    currentIndex=currentIndex+1
                    takingSamplesForWord=trainWords[currentIndex]
                    current_train_samples_count=len(os.listdir("dataset/training_labeled_data/"+takingSamplesForWord))
                    current_test_samples_count=len(os.listdir("dataset/testing_labeled_data/"+takingSamplesForWord))
            mode="train"
            if current_train_samples_count>=take_train_samples:
                mode="test"
    if interrupt & 0xFF == ord('1'):
        currentIndex=currentIndex+1
        takingSamplesForWord=trainWords[currentIndex]
        current_train_samples_count=len(os.listdir("dataset/training_labeled_data/"+takingSamplesForWord))
        current_test_samples_count=len(os.listdir("dataset/testing_labeled_data/"+takingSamplesForWord))
        while current_train_samples_count>=take_train_samples and  current_test_samples_count>=take_test_samples:
            currentIndex=currentIndex+1
            takingSamplesForWord=trainWords[currentIndex]
            current_train_samples_count=len(os.listdir("dataset/training_labeled_data/"+takingSamplesForWord))
            current_test_samples_count=len(os.listdir("dataset/testing_labeled_data/"+takingSamplesForWord))
        mode="train"
        if current_train_samples_count>=take_train_samples:
            mode="test"

cap.release()
cv2.destroyAllWindows()