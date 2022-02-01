import boto
from boto.s3.connection import S3Connection
from datetime import timedelta, datetime
import os
import pyart
from matplotlib import pyplot as plt
import tempfile
import numpy as np
import io
import base64

# %matplotlib inline


def get_plot_base64(year, month, date, station):
    my_pref = f"{year}/{month}/{date}/{station}/"
    
    #first lets connect to the bucket
    conn = S3Connection(anon = True)
    bucket = conn.get_bucket('noaa-nexrad-level2')
    
#     my_pref = '2019/06/26/KVWX/'
    bucket_list = list(bucket.list(prefix = my_pref))
    
    home_dir = os.path.expanduser('~')
    bucket_list[0].get_contents_to_filename(os.path.join(home_dir,'nexrad_tempfile'))
    
    radar = pyart.io.read(os.path.join(home_dir,'nexrad_tempfile'))
    
    my_figure = plt.figure(figsize = [10,8])
    my_display = pyart.graph.RadarDisplay(radar)
    my_display.plot_ppi('reflectivity', 0, vmin = -12, vmax = 64)
    
    
    s = io.BytesIO()
    my_figure.savefig(s, format='png', bbox_inches="tight")
    base64_str = base64.b64encode(s.getvalue()).decode("utf-8").replace("\n", "")
    return base64_str


