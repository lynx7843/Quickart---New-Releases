package com.example.backend.model;


public class TryOnResponse {

    private String generatedImageBase64;
    private String fitMatch;
    private String fitReason;
    private int    fitScore;
    private String message;

    public static TryOnResponse success(String imageBase64, String match,
                                        String reason, int score) {
        TryOnResponse r = new TryOnResponse();
        r.generatedImageBase64 = imageBase64;
        r.fitMatch  = match;
        r.fitReason = reason;
        r.fitScore  = score;
        return r;
    }

    public static TryOnResponse error(String message) {
        TryOnResponse r = new TryOnResponse();
        r.message = "Error: " + message;
        return r;
    }

    public String getGeneratedImageBase64() { return generatedImageBase64; }
    public void   setGeneratedImageBase64(String generatedImageBase64) {
        this.generatedImageBase64 = generatedImageBase64;
    }

    public String getFitMatch()  { return fitMatch; }
    public void   setFitMatch(String fitMatch)   { this.fitMatch = fitMatch; }

    public String getFitReason() { return fitReason; }
    public void   setFitReason(String fitReason) { this.fitReason = fitReason; }

    public int    getFitScore()  { return fitScore; }
    public void   setFitScore(int fitScore)      { this.fitScore = fitScore; }

    public String getMessage()   { return message; }
    public void   setMessage(String message)     { this.message = message; }
}
