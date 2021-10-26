<template>
  <CContainer class="d-flex content-center min-vh-100">
    <CRow class="w-100 w-lg-50">
      <CCol>
        <CCardGroup>
          <CCard class="p-4">
            <CCardBody>
              <CForm @submit.prevent="login()" >
                <h1>Login</h1>
                <p class="text-muted">Kirish</p>
                <CInput
                  placeholder="9989* ***-**-**"
                  v-model="form.phone_number"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CInput
                  placeholder="Parol"
                  type="password"
                  v-model="form.password"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CRow>
                  <CCol col="6" class="text-left">
                    <CButton type="submit" color="primary" class="px-4">Login</CButton>
                  </CCol>
                  <!-- <CCol col="6" class="text-right">
                    <CButton color="link" class="px-0">Forgot password?</CButton>
                  </CCol> -->
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return {
      form: {
        phone_number: '',
        password: '',
      }
    }
  },
  methods: {
    login(){
      this.$store.dispatch('login',this.form);
    }
  },
  mounted(){

  }
}
</script>
