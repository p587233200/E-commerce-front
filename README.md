# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

此repository為前端Vue
本專案是一個以 Vue 與 Spring Boot 為基礎開發的電商後台管理系統，並採用 PostgreSQL 作為資料庫。系統主要功能是模擬電商後台商品管理，提供管理人員方便的介面來進行商品、商品類型與屬性的維護。

a. 登入功能：須先登入才能檢視與操作，使用ＪＷＴtoken驗證。
b. 商品管理功能：
  1. 品牌管理：查看電商有哪些品牌，可增刪改查品牌。
  2. 屬性（標籤）管理：顯示可用的商品屬性（如顏色、尺寸、材質），可增刪改查。
  3. ＳＰU管理：查詢所有商品 SPU（標準商品單位，描述某一類商品的共通資訊，如品牌），可增刪改查。
  4. ＳＫＵ管理：顯示 SPU 下各個具體 SKU（庫存單位，對應實際銷售品項，設定價格、庫存數量、對應屬性（如顏色=粉色、尺寸=M），可改變商品是否上架。
