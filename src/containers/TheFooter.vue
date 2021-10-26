<template>
  <CFooter :fixed="false">
    <div>
      <a href="http://www.greatsoft.uz/" target="_blank">GreatSoft.uz</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}} Barcha huquqlar himoyalangan.</span>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
