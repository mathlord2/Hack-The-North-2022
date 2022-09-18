import cv2
from imutils.perspective import four_point_transform
import numpy as np

width, height = 800, 530
green = (0, 255, 0)

image = cv2.imread("document_test.png")
image = cv2.resize(image, (width, height))
orig_image = image.copy()

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (5, 5), 0)
edged = cv2.Canny(blur, 75, 200)

cv2.imshow("Original Image: ", image)
cv2.imshow("Edged: ", edged)
cv2.waitKey(0)
cv2.destroyAllWindows()

contours, _ = cv2.findContours(edged, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
contours = sorted(contours, key=cv2.contourArea, reverse=True)

cv2.imshow("Image", image)
cv2.drawContours(image, contours, -1, green, 3)
cv2.imshow("All contours", image)
cv2.waitKey(0)
cv2.destroyAllWindows()

for contour in contours:
    peri = cv2.arcLength(contour, True)
    approx = cv2.approxPolyDP(contour, 0.05 * peri, True)
    if len(approx) == 4:
        doc_cnts = approx
        break

cv2.drawContours(orig_image, [doc_cnts], -1, green, 3)
cv2.imshow("Contours of the document", orig_image)
warped = four_point_transform(orig_image, doc_cnts.reshape(4, 2))
cv2.imshow("Scanned", cv2.resize(warped, (600, 800)))
cv2.waitKey(0)
cv2.destroyAllWindows()

def get_edges(image: np.ndarray, width: int, height: int):
    image = cv2.resize(image, (width, height))
    orig_image = image.copy()

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blur, 75, 200)

    return orig_image, edged

def find_rectangular_contours(edged: np.ndarray):
    contours, _ = cv2.findContours(edged, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)

    rectangular_contours = []
    for contour in contours:
        peri = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.05 * peri, True)
        if len(approx) == 4:
            rectangular_contours.append(approx)

    return rectangular_contours

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
def largest_contains(contours, x, y):
    point = Point(x, y)
    for i in contours:
        polygon = Polygon(i)
        if polygon.contains(point):
            return i
    return None