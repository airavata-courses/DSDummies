package com.distsystems.main.utils;

public class GetPlotRequest {
    private String station;
    private int year;
    private int month;
    private int date;
    private int hour;

    public GetPlotRequest(String station, int year, int month, int date, int hour) {
        this.station = station;
        this.year = year;
        this.month = month;
        this.date = date;
        this.hour = hour;
    }

    public String getStation() {
        return station;
    }

    public void setStation(String station) {
        this.station = station;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDate() {
        return date;
    }

    public void setDate(int date) {
        this.date = date;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

}
