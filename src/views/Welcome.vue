<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">地府通用管理系统</div>
      <div class="desc">
        -elementplus+vue3+Node+MongoDB打造火星后台管理系统-
      </div>
    </div>
    <div class="img"></div>
  </div>
</template>
<script>
export default {
  name: "welcome",
};
</script>
<style lang="scss">
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;
  .content {
    position: relative;
    bottom: 40px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #4092ff;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 105px;
    width: 371px;
    height: 438px;
    background-image: url("../assets/images/welcome.png");
  }
}
</style>

