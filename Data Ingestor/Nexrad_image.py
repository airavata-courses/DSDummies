from siphon.radarserver import RadarServer
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import cartopy.feature as cfeature
import numpy as np
import metpy.plots as mpplots
import matplotlib
import io
import base64
matplotlib.use('Agg')
import warnings
warnings.filterwarnings("ignore")


def new_map(fig, lon, lat):
    # Create projection centered on the radar. This allows us to use x
    # and y relative to the radar.
    proj = ccrs.LambertConformal(central_longitude=lon, central_latitude=lat)

    # New axes with the specified projection
    ax = fig.add_axes([0.02, 0.02, 0.96, 0.96], projection=proj)

    # Add coastlines and states
    ax.add_feature(cfeature.COASTLINE.with_scale('50m'), linewidth=2)
    ax.add_feature(cfeature.STATES.with_scale('50m'))
    
    return ax


def raw_to_masked_float(var, data):
    # Values come back signed. If the _Unsigned attribute is set, we need to convert
    # from the range [-127, 128] to [0, 255].
    if var._Unsigned:
        data = data & 255

    # Mask missing points
    data = np.ma.array(data, mask=data==0)

    # Convert to float using the scale and offset
    return data * var.scale_factor + var.add_offset

def polar_to_cartesian(az, rng):
    az_rad = np.deg2rad(az)[:, None]
    x = rng * np.sin(az_rad)
    y = rng * np.cos(az_rad)
    return x, y


def get_image(station, year, month, date, time):
    try:
        dt = datetime(year, month, date, time)
        
        rs = RadarServer('http://tds-nexrad.scigw.unidata.ucar.edu/thredds/radarServer/nexrad/level2/S3/')
        query = rs.query()
        
        # Our specified time range
        query.stations(station).time(dt)
        
        if not rs.validate_query(query):
            return "invalid request"
        
        cat = rs.get_catalog(query)
        if len(cat.datasets) == 0:
            return None
        
        ref_norm, ref_cmap = mpplots.ctables.registry.get_with_steps('NWSReflectivity', 5, 5)
        
        ds = cat.datasets[0]
        data = ds.remote_access()
        fig = plt.figure(figsize=(10, 7.5))
        sLon, sLat = data.StationLongitude, data.StationLatitude
        ax = new_map(fig, sLon, sLat)

        # Set limits in lat/lon space
        ax.set_extent([sLon + 5, sLon - 5, sLat - 5, sLat + 5])

        ax.add_feature(cfeature.OCEAN.with_scale('50m'))
        ax.add_feature(cfeature.LAND.with_scale('50m'))
        
        
        for ds_name in cat.datasets:
            # After looping over the list of sorted datasets, pull the actual Dataset object out
            # of our list of items and access over CDMRemote
            data = cat.datasets[ds_name].remote_access()

            # Pull out the data of interest
            sweep = 0
            rng = data.variables['distanceR_HI'][:]
            az = data.variables['azimuthR_HI'][sweep]
            ref_var = data.variables['Reflectivity_HI']

            # Convert data to float and coordinates to Cartesian
            ref = raw_to_masked_float(ref_var, ref_var[sweep])
            x, y = polar_to_cartesian(az, rng)

            # Plot the data and the timestamp
            mesh = ax.pcolormesh(x, y, ref, cmap=ref_cmap, norm=ref_norm, zorder=0)
            text = ax.text(0.7, 0.02, data.time_coverage_start, transform=ax.transAxes,
                        fontdict={'size':16})
            
            #convert plot to base64
            s = io.BytesIO()
            plt.savefig(s, format='png', bbox_inches="tight")
            base64_str = base64.b64encode(s.getvalue()).decode("utf-8").replace("\n", "")
            return base64_str

            # Collect the things we've plotted so we can animate
            # meshes.append((mesh, text))
            
            
        
    
    except BaseException as error:
        print("*"*50)
        print(error)
        err_str = 'Error Occured while interating with AWS: ' +  str(error)
        raise Exception(err_str)
        
