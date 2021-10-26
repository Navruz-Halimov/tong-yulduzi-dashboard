<template>
  <div class="university">
    <div class="container country">
      <CRow  v-if="loader">
        <!-- <CCol md="12">
          <CForm>
            <CCollapse :show="collapse">
              <CRow>
                <CCol md="12">
                  <CInput
                    label="Sarlavha"
                    v-model="form.title"
                    valid-feedback="Yaxshi :)"
                    invalid-feedback="Kamida bitta so'z kiriting."
                    :is-valid="validator"
                    required
                  />
                </CCol>
                <CCol md="12">
                    <CInputFile
                        label="Gazeta fayli"
                        horizontal
                        custom
                        required
                        @change="getFile"
                        ref="inputFile"
                        />
                </CCol>
              </CRow>
            </CCollapse>
            <CRow class="mt-4">
              <CCol md="12">
                <CButton v-if="buttonToggle" @click="showTable()" class="float-right mb-3" color="success">Qo'shish</CButton>
                <CButton v-else class="float-right mb-3" color="success" @click="addNewspaper()" :disabled="submitLoader">
                  <span v-if="submitLoader" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Saqlash
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCol> -->
        <CCol md="10">
          <CInput
            placeholder="Qidirish"
            v-model="search"
          />
        </CCol>
        <CCol md="2"> 
          <CButton color="primary" class="w-100" @click="searchNewspaper()">Qidirish</CButton>
        </CCol>
        <CCol md="12">
          <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped table-light">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ism</th>
                  <th>Familiya</th>
                  <th>Telefon raqam</th>
                  <th>To'lov</th>
                  <th>Amal qilish muddati</th>
                  <th>O'zgartirish</th>
                  <th>O'chirish</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(list,index) in listing" :key="index">
                  <td>
                    {{ list.id }}
                  </td>
                  <td>
                    {{ list.firstname }}
                  </td>
                  <td>
                    {{ list.lastname }}
                  </td>
                  <td>
                    {{ list.phone_number }}
                  </td>
                  <td>
                    {{ list.payments_info.is_paid == false ? 'To\'lanmagan' : 'To\'langan' }}
                  </td>
                  <td>
                    {{ list.payments_info.payment_is_valid == null ? 'Mavjud emas' : list.payments_info.payment_is_valid }}
                  </td>
                  <td>
                    <button class="btn btn-warning mx-auto d-block" @click="updateListNewspaper(list.id)">
                      O'zgartirish
                    </button>
                    <CModal
                      title="O'zgartirish"
                      color="warning"
                      :show.sync="warningModal"
                      :closeOnBackdrop="false"
                      v-if="list.id == pk"
                    >
                      <CRow  v-if="editLoader">
                        <CCol md="12">  
                            <orbit-spinner 
                            :animation-duration="1000"
                            :size="120"
                            :color="'#0E1E52'"
                            class="d-block mx-auto"
                            />
                        </CCol>
                      </CRow>
                      <CRow v-else>
                        <CCol md="6">
                          <CInput
                            label="Ism"
                            v-model="update.firstname"
                            valid-feedback="Yaxshi :)"
                            invalid-feedback="Kamida bitta so'z kiriting."
                            :is-valid="validator"
                          />
                        </CCol>
                        <CCol md="6">
                          <CInput
                            label="Familiya"
                            v-model="update.lastname"
                            valid-feedback="Yaxshi :)"
                            invalid-feedback="Kamida bitta so'z kiriting."
                            :is-valid="validator"
                          />
                        </CCol>
                        <CCol md="6">
                          <CInput
                            label="Telefon raqam"
                            v-model="update.phone_number"
                            valid-feedback="Yaxshi :)"
                            invalid-feedback="Kamida bitta so'z kiriting."
                            :is-valid="validator"
                          />
                        </CCol>
                      </CRow>
                      <div slot="footer">
                          <div slot="footer-wrapper">
                            <CButton class="btn btn-warning float-right" @click="saveUpdatedNewspaper(list.id)">
                              Saqlash
                            </CButton>
                          </div>
                      </div>
                    </CModal>
                  </td>
                  <td>
                    <button class="btn btn-danger mx-auto d-block" @click="deleteNewspaper(list.id)">
                      O'chirish
                    </button>
                    <CModal
                      title="O'chirmoqchimisiz?"
                      color="danger"
                      :show.sync="deleteHandler"
                      v-if="list.id == deletePk"
                    > 
                    <h3>{{ list.firstname }} {{ list.lastname }}</h3>
                    <div slot="footer">
                        <div slot="footer-wrapper">
                            <CButton class="btn btn-danger mr-3" @click="deleteFile(list.id)">
                            Ok
                            </CButton>
                            <CButton class="btn btn-primary" @click="deleteHandler = false">
                            Bekor qilish
                            </CButton>
                        </div>
                    </div> 
                    </CModal>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CCol>
         <CCol md="12" class="mb-4">
          <div class="mx-auto d-block text-center">
            <CButton  class="btn btn-primary mr-3" :disabled="left" @click="listNewspaper(-1)">Oldingisi</CButton>
            <CButton  class="btn btn-primary mr-3" :disabled="next" @click="listNewspaper(1)">Keyingisi</CButton>
          </div>
        </CCol>
      </CRow>
      <CRow v-else>
        <CCol md="12">  
          <div class="orb">
            <orbit-spinner 
            :animation-duration="1000"
            :size="120"
            :color="'#0E1E52'"
            class="d-block mx-auto"
            />
          </div>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        // form: {
        //     title: '',
        //     file: null,
        // },
        update: {
          firstname: '',
          lastname: '',
          phone_number: ''
        },
        buttonToggle: true,
        collapse: false,
        left: false,
        next: false,
        sum: 1,
        listing: [],
        pk: 0,
        deletePk: 0,
        warningModal: false,
        editLoader: true,
        search: '',
        loader: false,
        loaderEdit: true,
        submitLoader: false,
        clicked: false,
        deleteHandler: false,
    }
  },
  methods: {
    validator(val){
      return (val && val.length) > 0 ? true : false
     },
    getFile(event){
        this.form.file = event[0];
    },
    deleteNewspaper(id){
      this.deletePk = id;
      this.deleteHandler = true;
    },
    async deleteFile(id){
      await this.$http.delete(`user/${id}/`)
      .then(() => {
        this.$toast.success("Muvaffaqiyatli o'chirildi.")
        this.listNewspaper(0);
      })
      .catch(() => {
        this.$toast.error("O'chirishdada xatolik yuz berdi.")
      })
    },
    async saveUpdatedNewspaper(id){
      await this.$http.patch(`user/${id}/`,this.update)
      .then(() => {
        this.$toast.success("Muvaffaqiyatli o'zgartirildi.")
        this.warningModal = false;
     
        this.listNewspaper(0);
      })
      .catch(() => {
        this.$toast.error("O'zgartirishda xatolik yuz berdi.")
      })
    },
    async updateListNewspaper(id){
        this.warningModal = true;
        this.pk = id;
        await this.$http.get(`user/${id}/`)
        .then(res => {
          this.editLoader = false;
          this.update = res.data;
        })
        .catch(err => {
          console.log(err);
        })
    },
    async searchNewspaper(){
      if(this.search){
        this.loader = false;
        await this.$http.get(`user/search/?search=${this.search}`)
        .then(res => {
          if(res.data.results.length){
            this.loader = true;
            this.listing = res.data.results;
          }else{
            this.listNewspaper(0);
            this.$toast.error('Qidirilayotgan obunachi topilmadi.')
          }
        })
        .catch(() => {
          this.$toast.error('Qidirilayotgan obunachi topilmadi.')
        })
      }else{
        this.listNewspaper(0);
      }
    },
    showTable(){
        this.buttonToggle = false;
        this.collapse = true;
    },
    // async addNewspaper(){
    //     let formData = new FormData();
    //     formData.append('title',this.form.title);
    //     formData.append('file',this.form.file);
    //     await this.$http.post('newspaper/',formData)
    //     .then(() => {
    //         this.form = {};
    //         // this.$refs['inputFile'].reset();
    //         this.collapse = false;
    //         this.$toast.success('Muvaffaqiyatli qo\'shildi.')
    //         this.buttonToggle = true;
    //         this.listNewspaper(0);
    //     })
    //     .catch(() => {
    //         this.$toast.error('Xatolik yuz berdi.')
    //     })
    // },
    async listNewspaper(num){
        this.loader = false;
        this.sum = num == 0 ? this.sum : this.sum+num;
        await this.$http.get(`user/?page=${this.sum}`)
        .then(res => {
            this.loader = true;
            this.listing = res.data.results;
            this.left = res.data.previous != null ? false : true;
            this.next = res.data.next != null ? false : true;
        })
        .catch(err => {
            console.log(err);
        })
    },
  },
  mounted(){
      this.listNewspaper(0);
  }
}
</script>