'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

import { Provider } from "react-redux";
import rootReducer from "../reducer/index";
import {configureStore} from "@reduxjs/toolkit"

const inter = Inter({ subsets: ["latin"] });


const store = configureStore({
  reducer:rootReducer,
  });

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>

        <Provider store = {store}>
            <Toaster />
            {children}
       </Provider>

      </body>
    </html>
  );
}