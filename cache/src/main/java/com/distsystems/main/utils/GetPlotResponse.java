package com.distsystems.main.utils;

public class GetPlotResponse {
    private String resp;
    private String status;

    public GetPlotResponse() {
        super();
    }

    public GetPlotResponse(String resp, String status) {
        this.resp = resp;
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResp() {
        return resp;
    }

    public void setResp(String resp) {
        this.resp = resp;
    }
}
