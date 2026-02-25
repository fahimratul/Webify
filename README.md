##YouTube Link
```
https://youtu.be/xweznt0w4Co?si=S9hq65WgJcjYeRkL
```
data flow achi
```
https://mermaid.ai/play?utm_source=mermaid_live_editor&utm_medium=main_menu#pako:eNp1U8Fu4jAQ_ZVRDhUcIAJuHFYCUiQkKgVYeml6cJ0hWCR21rHpRqv99504TgtB60sk-7158-ZN_gRcpRjMg9FolEiu5Elk80QC5KxW1swB80si3eMpV5_8zLSB7Z4Qlf3INCvPcEB9Rf2WBEvGLyhTfwFblQmeBO9NtfbEk0ESLKw5wxNsUpRGmBpirThWVRIMb4BTAr4wfUFT5owjvDDJMtT3oBmBVqoorKQ64VppW3SiDka93PVplKYi1OiKpDXLIWKGuWu8azNavjXySmYqWlKt9-9idI4V6gG9N196HMJoBEkwYWOnLcODyKQtwz1WaGCPvyxWJgkI9YP8tyXiiSd9jGFnUdfhsUyZQVcbNvKkPIHk7wl8TNOlEb-iFifBmRFKeqmtkBdPey6YyA_6SlaffxvUkry6OxeN4N92O6Qvn449LsJcUIa1L-i8frlvwVNyfCxzxVJY0QrRHLWQGQy2ipPc0oo8RT3snE-9kaknk_MDuyL8xIISJuuR4j3TN1JkO7aalq_CMFKf0qn2ZttXIC9uSvUXlbZujYafXb__FZuRr1hVBnbhApSGV2U6cDzzGjMPJRcbSUzTBbh7WjROqn5-HYE3BK6xoA10lSm80hqXY48TLT2HjLRtrxHTR_xDUziGSFQ01Rraf6JZ84cg_d_gh9Vw2sjvwjSqC_KGH_z9B9F0Qp0

```

data center architecture
```
https://mermaid.ai/play?utm_source=mermaid_live_editor&utm_medium=main_menu#pako:eNp9U11vm0AQ_CsrpES2VIzaR1RF4iuyJZykgNMHyMMZ1jYKvkN3R1ur6X_vwuEKW0nvAQE7MzvDLr-tUlRoudZesvYAWVhwoHNzA9kBYaNQwoprlDtWoimpbmuwmxXkhXUJUYX1YmD9if08FiVrwO_qpiKcDb4UP4kxAT0JqVmTr5l8Rd02JAK3EIjjseO1PsF33ILXtiMBeVXwC4s-K1_pLcRiX5cw855W8yufZwSZfaCsTvSrlagUpCh_kKfZwJxfGPc6fcj7i5F14RllvTs5CSrUTv-OT9DG-jSBS4lPTopN42zaRrBqgr4Xsjvm_wK68O3Wc56Frvn-_ZDLCJaRl2TucBt6mQdp9phEVzFDptmy2_Yxg-ghS7x4ip2mW4d-PlsLvhehP9C2TOH83eaB4BxLXQuuQAsauanEPny1bSisz4vhWyHXdck0ggMmLxErLCyw7bvz9zdMM-2R_WVhNoeVmphmNfqb7nRN_chQ797UzlM2ykGyCeGxJekBOspR8IlU2mJZ72hpehG4b6i7qREM7IV995ZqIcefIJBY1X1M1qhPQ2bIBDWkB5ofbSxNEBUwbqIDo_3Skmaq3kzbsemV9n-LE-EBZ_35C5uBHxk

``` 


### Probable Architecture
```
/Webify
/backend
├── /middleware
│   └── auth.js         <-- The "Bouncer" (checks if user is logged in)
├── /routes
│   ├── projects.js     <-- API for Saving/Loading layouts
│   └── users.js        <-- API for Login/Signup
├── /models
│   └── Project.js      <-- The "Blueprint" for MongoDB (what a site looks like)
├── .env                <-- Our MongoDB Connection String (KEEP THIS SECRET)
└── server.js           <-- The "Main Brain" (Bun/Express)
│
├── /frontend-static      <-- Regular HTML/CSS/JS
│   ├── /assets           <-- Images/Logos
│   ├── /css              <-- Global styles (Tailwind)
│   ├── index.html        <-- Homepage
│   ├── marketplace.html  <-- The "Showcase" page
│   └── script.js         <-- Simple logic for their pages
│
├── /frontend-builder     <-- The SolidJS App
│   ├── /src              <-- Our Drag & Drop components
│   ├── index.jsx         <-- Entry point for Solid
│   └── package.json      <-- SolidJS dependencies
│
└── package.json          <-- Root settings to glue it all together
```

### Storage Optimization Plan
- Store images, videos somewhere else, not in mongo. Otherwise we will hit storage limit soon.
- Maybe we will store images and videos in Cloudinary and store the links in mongo.
