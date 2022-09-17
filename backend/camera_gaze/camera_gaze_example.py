'''
Display a gaze marker on the camera/scene video. Demonstrates how to receive frames from the camera, map gaze data onto
a camera frame, and draw a gaze marker.
'''

import math
import sys

# This example requires the PySide2 library for displaying windows and video. Other such libraries are avaliable, and
# you are free to use whatever you'd like for your projects.
from PySide2 import QtCore, QtGui, QtWidgets

import adhawkapi
import adhawkapi.frontend
from adhawkapi import MarkerSequenceMode, PacketType
import numpy as np
from PIL import Image

MARKER_SIZE = 20  # Diameter in pixels of the gaze marker
MARKER_COLOR = (0, 250, 50)  # Colour of the gaze marker

def QPixmapToArray(pixmap):
    ## Get the size of the current pixmap
    size = pixmap.size()
    h = size.width()
    w = size.height()

    ## Get the QImage Item and convert it to a byte string
    qimg = pixmap.toImage()
    byte_str = qimg.bits().tobytes()

    ## Using the np.frombuffer function to convert the byte string into an np array
    img = np.frombuffer(byte_str, dtype=np.uint8).reshape((w,h,4))

    return img
class Frontend:
    ''' Frontend communicating with the backend '''

    def __init__(self, handle_gaze_in_image_stream, video_receiver_address):
        # Instantiate an API object
        self._api = adhawkapi.frontend.FrontendApi()

        # Tell the api that we wish to tap into the GAZE_IN_IMAGE data stream with the given callback as the handler
        self._api.register_stream_handler(PacketType.GAZE_IN_IMAGE, handle_gaze_in_image_stream)

        # Start the api and set its connection callback to self._handle_connect. When the api detects a connection to a
        # tracker, this function will be run.
        self._api.start(connect_cb=self._handle_connect_response)

        # Stores the video receiver's address
        self._video_receiver_address = video_receiver_address

        # Flags the frontend as not connected yet
        self.connected = False

    def shutdown(self):
        ''' Shuts down the backend connection '''

        # Stops the video stream
        self._api.stop_video_stream(*self._video_receiver_address, lambda *_args: None)

        # Stops api camera capture
        self._api.stop_camera_capture(lambda *_args: None)

        # Stop the log session
        self._api.stop_log_session(lambda *_args: None)

        # Shuts down the api
        self._api.shutdown()

    def quickstart(self):
        ''' Runs a Quick Start using AdHawk Backend's GUI '''

        # The tracker's camera will need to be running to detect the marker that the Quick Start procedure will display
        self._api.quick_start_gui(mode=MarkerSequenceMode.FIXED_GAZE, marker_size_mm=35,
                                  callback=(lambda *_args: None))

    def calibrate(self):
        ''' Runs a Calibration using AdHawk Backend's GUI '''

        # Two calibration modes are supported: FIXED_HEAD and FIXED_GAZE
        # With fixed head mode you look at calibration markers without moving your head
        # With fixed gaze mode you keep looking at a central point and move your head as instructed during calibration.
        self._api.start_calibration_gui(mode=MarkerSequenceMode.FIXED_HEAD, n_points=9, marker_size_mm=35,
                                        randomize=False, callback=(lambda *_args: None))

    def _handle_connect_response(self, error):

        # Starts the camera and sets the stream rate
        if not error:

            # Sets the GAZE_IN_IMAGE data stream rate to 125Hz
            self._api.set_stream_control(PacketType.GAZE_IN_IMAGE, 125, callback=(lambda *args: None))

            # Starts the tracker's camera so that video can be captured and sets self._handle_camera_start_response as
            # the callback. This function will be called once the api has finished starting the camera.
            self._api.start_camera_capture(camera_index=0, resolution_index=adhawkapi.CameraResolution.MEDIUM,
                                           correct_distortion=False, callback=self._handle_camera_start_response)

            # Starts a logging session which saves eye tracking signals. This can be very useful for troubleshooting
            self._api.start_log_session(log_mode=adhawkapi.LogMode.BASIC, callback=lambda *args: None)

            # Flags the frontend as connected
            self.connected = True

    def _handle_camera_start_response(self, error):

        # Handles the response after starting the tracker's camera
        if error:
            # End the program if there is a camera error
            print(f'Camera start error: {error}')
            self.shutdown()
            sys.exit()
        else:
            # Otherwise, starts the video stream, streaming to the address of the video receiver
            self._api.start_video_stream(*self._video_receiver_address, lambda *_args: None)


class GazeViewer(QtWidgets.QWidget):
    ''' Class for receiving and displaying the video stream '''

    def __init__(self):
        QtWidgets.QWidget.__init__(self)
        self.setWindowTitle('Gaze in image example')

        self.text_label = QtWidgets.QLabel('Q: run a Quick Start,  C: run a Calibration')
        self.text_label.setAlignment(QtCore.Qt.AlignCenter)

        # Qt code to create a label that can hold an image. We will use this label to hold successive images from the
        # video stream.
        self.image_label = QtWidgets.QLabel(self)
        vbox = QtWidgets.QVBoxLayout()
        vbox.addWidget(self.text_label)
        vbox.addWidget(self.image_label)
        self.setLayout(vbox)

        # A Quick Start tunes the scan range and frequency to best suit the user's eye and face shape, resulting in
        # better tracking data. For the best quality results in your application, you should also perform a calibration
        # before using gaze data.
        self.quickstart_shortcut = QtWidgets.QShortcut(QtGui.QKeySequence('q'), self)
        self.quickstart_shortcut.activated.connect(self.quickstart)

        # A calibration allows us to relate the measured gaze with the real world using a series of markers displayed
        # in known positions
        self.calibration_shortcut = QtWidgets.QShortcut(QtGui.QKeySequence('c'), self)
        self.calibration_shortcut.activated.connect(self.calibrate)

        self.take_shortcut = QtWidgets.QShortcut(QtGui.QKeySequence('t'), self)
        self.take_shortcut.activated.connect(self.take_vertex)

        # Instantiate and start a video receiver with self._handle_video_stream as the handler for new frames
        self._video_receiver = adhawkapi.frontend.VideoReceiver()
        self._video_receiver.frame_received_event.add_callback(self._handle_video_stream)
        self._video_receiver.start()

        # Instantiate a Frontend object. We give it the address of the video receiver, so the api's video stream will
        # be sent to it.
        self.frontend = Frontend(self._handle_gaze_in_image_stream, self._video_receiver.address)

        # Initialize the gaze coordinates to dummy values for now
        self._gaze_coordinates = (0, 0)
        self.last_frame = None
        self.cur_shot = 0

        self.extra_coords = []

        self.change_alpha = 0
        self.brightness_change = 0

    def closeEvent(self, event):
        '''
        Override of the window's close event. When the window closes, we want to ensure that we shut down the api
        properly.
        '''

        self.frontend.shutdown()
        super().closeEvent(event)

    @property
    def connected(self):
        ''' Property to allow the main loop to check whether the api is connected to a tracker '''
        return self.frontend.connected

    def quickstart(self):
        ''' Function to allow the main loop to invoke a Quick Start '''
        self.frontend.quickstart()

    def calibrate(self):
        ''' Function to allow the main loop to invoke a Calibration '''
        self.frontend.calibrate()

    def take_vertex(self):
        print("hello")
        self.add_extra_coord(self._gaze_coordinates[0], self._gaze_coordinates[1])

    def reset_extra(self):
        self.extra_coords = []

    def add_extra_coord(self, x, y):
        if math.isnan(x) or math.isnan(y):
            return
        self.extra_coords.append([x, y])
        if len(self.extra_coords) == 2:
            x1, y1, x2, y2 = self.extra_coords[0][0], self.extra_coords[0][1], self.extra_coords[1][0], self.extra_coords[1][1]
            x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
            cropped = self.last_frame[min(y1, y2):max(y1,y2),min(x1,x2):max(x1,x2)]
            Image.fromarray(cropped).save(f"take-{self.cur_shot}.png")
            self.cur_shot += 1
            self.reset_extra()

            self.brightness_change = 255
            self.change_alpha = 255
        elif len(self.extra_coords) == 1:
            self.change_alpha = 100

    def draw_extra_coords(self, qt_img):
        # Draws the gaze marker on the given frame image
        painter = QtGui.QPainter(qt_img)
        painter.setRenderHint(QtGui.QPainter.Antialiasing)
        painter.setBrush(QtGui.QBrush(QtGui.QColor(250, 0, 0), QtCore.Qt.SolidPattern))
        for x, y in self.extra_coords:
            painter.drawEllipse(QtCore.QRectF(x - MARKER_SIZE / 2, y - MARKER_SIZE / 2, MARKER_SIZE, MARKER_SIZE))
        painter.end()

    def draw_rect(self, r, g, b, a, qt_img: QtGui.QPixmap):
        painter = QtGui.QPainter(qt_img)
        painter.setBrush(QtGui.QBrush(QtGui.QColor(r, g, b, a), QtCore.Qt.SolidPattern))
        painter.drawRect(QtCore.QRect(0, 0, qt_img.width().real, qt_img.height().real))
        painter.end()

    def _handle_video_stream(self, _gaze_timestamp, _frame_index, image_buf, _frame_timestamp):

        # Create a new Qt pixmap and load the frame's data into it
        qt_img = QtGui.QPixmap()
        qt_img.loadFromData(image_buf, 'JPEG')
        self.last_frame = QPixmapToArray(qt_img)

        # Get the image's size. If self._frame_size has not yet been initialized, we set its values to the frame size.
        size = qt_img.size().toTuple()
        if size[0] != self.image_label.width() or size[1] != self.image_label.height():

            # Set the image label's size to the frame's size
            self.image_label.resize(size[0], size[1])

        self.draw_rect(self.brightness_change, self.brightness_change, self.brightness_change, self.change_alpha, qt_img)
        if self.brightness_change == 255:
            self.change_alpha -= 10
            if self.change_alpha <= 0:
                self.change_alpha = 0
                self.brightness_change = 0

        # Draws the gaze marker on the new frame
        self._draw_gaze_marker(qt_img)

        self.draw_extra_coords(qt_img)

        # Sets the new image
        self.image_label.setPixmap(qt_img)

    def _handle_gaze_in_image_stream(self, _timestamp, gaze_img_x, gaze_img_y, *_args):

        # Updates the gaze marker coordinates with new gaze data. It is possible to receive NaN from the api, so we
        # filter the input accordingly.
        self._gaze_coordinates = [gaze_img_x, gaze_img_y]

    def _draw_gaze_marker(self, qt_img):
        if math.isnan(self._gaze_coordinates[0]) or math.isnan(self._gaze_coordinates[1]):
            return

        # Draws the gaze marker on the given frame image
        painter = QtGui.QPainter(qt_img)
        painter.setRenderHint(QtGui.QPainter.Antialiasing)
        painter.setBrush(QtGui.QBrush(QtGui.QColor(*MARKER_COLOR), QtCore.Qt.SolidPattern))
        painter.drawEllipse(QtCore.QRectF(self._gaze_coordinates[0] - MARKER_SIZE / 2,
                                          self._gaze_coordinates[1] - MARKER_SIZE / 2,
                                          MARKER_SIZE, MARKER_SIZE))
        painter.end()


def main():
    '''Main function'''
    app = QtWidgets.QApplication(sys.argv)
    main_window = GazeViewer()
    try:
        print('Plug in your tracker and ensure AdHawk Backend is running.')
        while not main_window.connected:
            pass  # Waits for the frontend to be connected before proceeding
    except (KeyboardInterrupt, SystemExit):
        main_window.close()
        # Allows the frontend to be shut down robustly on a keyboard interrupt

    main_window.show()
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()