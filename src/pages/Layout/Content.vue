<template>
  <transition name="k-page" mode="out-in">
    <router-view></router-view>
  </transition>
</template>
<script>
export default {};
</script>
<style>
/* page change: fade + slide up with a soft settle; quick fade out */
.k-page-enter-active {
  transition: opacity 0.32s ease, transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
}
.k-page-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.k-page-enter {
  opacity: 0;
  transform: translateY(16px) scale(0.995);
}
.k-page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
