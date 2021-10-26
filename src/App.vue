<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  created: function () {
    this.$http.interceptors.response.use(undefined, (err) =>  {
      return new Promise((resolve, reject) => {
        // console.log(err.request.status);
        if (err.request.status == 401 && !err.request.__isRetryRequest) {
          this.$store.dispatch('logout')
        }
        reject(err);
      });
    });
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
