<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>歡迎來到我的</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
              :loading="loading"
              >登入</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import useUserStore from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";
import { getTime } from "@/utils/time";

const validatoruserName = (rule: any, value: any, callback: any) => {
  //rule校驗規則本身
  //函數如果符合條件callback放行通過，如果不符合注入錯誤提示訊息
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error("帳號長度至少五位"));
  }
};
const validatorPassword = (rule: any, value: any, callback: any) => {
  //rule校驗規則本身
  //函數如果符合條件callback放行通過，如果不符合注入錯誤提示訊息
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error("米瑪長度至少六位"));
  }
};
let loginForm = reactive({ username: "admin", password: "111111" });
const rules = reactive({
  username: [
    // { required: true, min: 5, message: "帳號長度至少五位", trigger: "change" }
    { trigger: "change", validator: validatoruserName },
  ],
  password: [
    // { required: true, min: 6, message: "密碼長度至少六位", trigger: "change" }
    { trigger: "change", validator: validatorPassword },
  ],
});
let $router = useRouter();
let $route = useRoute();
let userStore = useUserStore();
let loginForms = ref();
let loading = ref(false);

const login = async () => {
  //保證全部表單校驗成功才發請求
  await loginForms.value.validate();
  loading.value = true;
  try {
    await userStore.useLogin(loginForm);
    let redirect: any = $route.query.redirect;
    $router.push({ path: redirect || "/" });
    //登入成功提示訊息
    ElNotification({
      type: "success",
      message: "登入成功",
      title: `Hi, ${getTime()}好`,
    });
    loading.value = false;
  } catch (error) {
    loading.value = false;
    ElNotification({
      type: "error",
      message: (error as Error).message,
    });
  }
};
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background-image: url("@/assets/images/background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background-image: url("@/assets/images/login_form.png");
  background-repeat: no-repeat;
  background-size: cover;
  border: solid black 1px;
  border-radius: 10px;
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0;
  }

  .login_btn {
    width: 100%;
  }
}
</style>
