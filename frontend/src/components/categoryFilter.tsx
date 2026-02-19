"use client";

import { useState } from "react";
import PrimaryButton from "@/components/primaryButton";

export default function CategoryFilter(){
   return (
    <>
        <div className="flex items-center justify-center py-4 md:py-8 flex-wrap gap-3">
            <PrimaryButton text="All categories" type="button" />
            <PrimaryButton text="Tops" type="button" />
            <PrimaryButton text="Bottoms" type="button" />
            <PrimaryButton text="Dresses" type="button" />
            <PrimaryButton text="Shoes" type="button" />
        </div>
    </>
   ) 
    

}

