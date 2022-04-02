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
import xarray as xr
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
            
            
        
    
    except BaseException as error:
        print("*"*50)
        print(error)
        err_str = 'Error Occured while interating with AWS: ' +  str(error)
        raise Exception(err_str)
        


def get_image_M2(station, year, month, date):
    try:
        dt = datetime(year, month, date)
        collection_shortname = 'M2T1NXAER'
        collection_longname  = 'tavg1_2d_aer_Nx'
        collection_number = 'MERRA2_400'  
        MERRA2_version = '5.12.4'
        year = year
            
        # Open dataset
        # Read selected days in the same month and year
        month = month  # January
        day_beg = date
        day_end = date + 1
            
        # Note that collection_number is MERRA2_401 in a few cases, refer to "Records of MERRA-2 Data Reprocessing and Service Changes"
        if year == 2020 and month == 9:
            collection_number = 'MERRA2_401'
                    
        # OPeNDAP URL 

        url = 'https://goldsmr4.gesdisc.eosdis.nasa.gov/opendap/MERRA2/{}.{}/{}/{:0>2d}'.format(collection_shortname, MERRA2_version, year, month)
        files_month = ['{}/{}.{}.{}{:0>2d}{:0>2d}.nc4'.format(url,collection_number, collection_longname, year, month, days) for days in range(day_beg,day_end+1,1)]
            
        # Read dataset URLs
        ds = xr.open_mfdataset(files_month)

        sel_var_shortname = "TOTEXTTAU"
        sel_var_value= ds[sel_var_shortname]

        # Daily mean (i.e., the averaged value over a day at each grid)
        sel_var_daily_mean = sel_var_value.resample(time="1D").mean(dim='time', skipna=True)

        pmap = sel_var_daily_mean.isel(time=[0, 1]).plot(transform=ccrs.PlateCarree(),  # the data's projection
                    col='time', col_wrap=2, robust=True, # multiplot settings
                    cmap=plt.cm.Spectral_r,
                    cbar_kwargs={
                    "orientation": "horizontal",
                    "shrink": 0.9,
                    "aspect": 40,
                    "pad": 0.1,
                                },
                    subplot_kws={'projection': ccrs.PlateCarree(central_longitude=180)})


        #convert plot to base64
        s = io.BytesIO()
        figFile_plot = "newMap.png"
        plt.savefig(s, dpi=500, format='png', bbox_inches="tight")
        base64_str = base64.b64encode(s.getvalue()).decode("utf-8").replace("\n", "")
        return base64_str
    
            
            
        
    
    except BaseException as error:
        print("*"*50)
        print(error)
        err_str = 'Error Occured while interating with MERRA2 data: ' +  str(error)
        raise Exception(err_str)
        
