package com.distsystems.main.utils;

public class GetPlotRequest {
	
    public GetPlotRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	private String station;
    private String year;
    private String month;
    private String date;
    private String hour;
    private boolean video;

    public GetPlotRequest(String station, String year, String month, String date, String hour, boolean video) {
        this.station = station;
        this.year = year;
        this.month = month;
        this.date = date;
        this.hour = hour;
        this.video = video;
    }

    public String getStation() {
        return station;
    }

    @Override
	public String toString() {
		return "GetPlotRequest [station=" + station + ", year=" + year + ", month=" + month + ", date=" + date
				+ ", hour=" + hour + ", video=" + video + "]";
	}

	public boolean isVideo() {
		return video;
	}

	public void setVideo(boolean video) {
		this.video = video;
	}

	public void setStation(String station) {
        this.station = station;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getHour() {
        return hour;
    }

    public void setHour(String hour) {
        this.hour = hour;
    }

}
