/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    isMobileView: boolean;
    isPrimeUser: boolean;
    isAppView: boolean;
    requestDomain: string;
    akamaiHeader: string;
    akamaiHeaderCountryCode: string;
    isGlance: boolean;
  }
}
