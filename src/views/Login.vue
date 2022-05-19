<template>
  <div class="login-wrapper">
    <div class="model">
      <el-form :model="user" status-icon :rules="rules" ref="userForm">
        <div class="title">火星</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            :prefix-icon="el - icon - user"
            v-model="user.userName"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            :prefix-icon="el - icon - view"
            v-model="user.userPwd"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><View /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import md5 from "md5";
import { User, View } from "@element-plus/icons";
export default {
  name: "Login",
  components: {
    User,
    View,
  },
  data() {
    return {
      user: {
        userName: "张三",
        userPwd: "123456",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur " },
        ],
        userPwd: [{ required: true, message: "请输入密码", trigger: "blur " }],
      },
    };
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          let user = {
            userName: this.user.userName,
            userPwd: md5(this.user.userPwd),
          };
          this.$api.login(user).then((res) => {
            this.$store.commit("saveUserInfo", res);
            this.$router.push({ name: "welcome" });
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .model {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 3px #c7c9cb4d;
    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>

