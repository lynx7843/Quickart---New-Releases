package com.example.backend.model;

public class TryOnRequest {

    private String userImageBase64;

    private String clothImageBase64;


    private String selectedSize;


    public String getUserImageBase64()  { return userImageBase64; }
    public void   setUserImageBase64(String userImageBase64)  { this.userImageBase64 = userImageBase64; }

    public String getClothImageBase64() { return clothImageBase64; }
    public void   setClothImageBase64(String clothImageBase64) { this.clothImageBase64 = clothImageBase64; }

    public String getSelectedSize()     { return selectedSize; }
    public void   setSelectedSize(String selectedSize)     { this.selectedSize = selectedSize; }
}
