<template>
  <div class="university">
    <div class="container country">
      <CRow  v-if="loader">
        <CCol md="12">
          <CForm>
            <CCollapse :show="collapse">
              <CRow>
                <CCol md="12">
                  <CInput
                    label="Hajmi"
                    v-model="form.amount"
                    valid-feedback="Yaxshi :)"
                    invalid-feedback="Kamida bitta so'z kiriting."
                    :is-valid="validator"
                    required
                  />
                </CCol>
                <CCol md="12">
                  <CInput
                    label="Davomiyligi"
                    v-model="form.duration"
                    valid-feedback="Yaxshi :)"
                    invalid-feedback="Kamida bitta so'z kiriting."
                    :is-valid="validator"
                    required
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
        </CCol>
        <!-- <CCol md="10">
          <CInput
            placeholder="Qidirish"
            v-model="search"
          />
        </CCol>
        <CCol md="2"> 
          <CButton color="primary" class="w-100" @click="searchNewspaper()">Search</CButton>
        </CCol> -->
        <CCol md="12">
          <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped table-light">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hajmi</th>
                  <th>Davomiyligi /oy</th>
                  <th>Sana</th>
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
                    {{ list.amount }}
                  </td>
                  <td>
                    {{ list.duration }}
                  </td>
                  <td>
                    {{ list.changed_at.substr(0,10) }}
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
                        <CCol md="12">
                            <CInput
                                label="Hajmi"
                                v-model="update.amount"
                                valid-feedback="Yaxshi :)"
                                invalid-feedback="Kamida bitta so'z kiriting."
                                :is-valid="validator"
                                required
                            />
                            </CCol>
                            <CCol md="12">
                            <CInput
                                label="Davomiyligi"
                                v-model="update.duration"
                                valid-feedback="Yaxshi :)"
                                invalid-feedback="Kamida bitta so'z kiriting."
                                :is-valid="validator"
                                required
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
                      v-if="list.id == pk"
                    > 
                    <h3>{{ list.duration }} oy uchun {{ list.amount }} so'm</h3>
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
         <!-- <CCol md="12" class="mb-4">
          <div class="mx-auto d-block text-center">
            <CButton  class="btn btn-primary mr-3" :disabled="left" @click="listNewspaper(-1)">Previous</CButton>
            <CButton  class="btn btn-primary mr-3" :disabled="next" @click="listNewspaper(1)">Next</CButton>
          </div>
        </CCol> -->
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
        form: {
            amount: null,
            duration: null,
        },
        update: {
            amount: null,
            duration: null,
        },
        buttonToggle: true,
        collapse: false,
        left: false,
        next: false,
        sum: 1,
        listing: [],
        pk: 0,
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
  computed: {
      validation(){
          // console.log(this.form.duration);
      }
  },
  methods: {
    validator(val){
      return (val && val.length) > 0 ? true : false
     },
    deleteNewspaper(id){
      this.pk = id;
      this.deleteHandler = true;
    },
    async deleteFile(id){
      await this.$http.delete(`payment/amount/${id}/`)
      .then(() => {
        this.$toast.success("Muvaffaqiyatli o'chirildi.")
        this.listNewspaper();
      })
      .catch(() => {
        this.$toast.error("O'chirishdada xatolik yuz berdi.")
      })
    },
    async saveUpdatedNewspaper(id){
      this.update.duration = +this.update.duration;
      if(this.update.duration == 2 || this.update.duration == 3 || this.update.duration == 4 || this.update.duration == 6 || this.update.duration == 12){
        await this.$http.patch(`payment/amount/${id}/`,this.update)
        .then(() => {
          this.$toast.success("Muvaffaqiyatli o'zgartirildi.")
          this.warningModal = false;
          this.update = {
            amount: null,
            duration: null,
          };
          this.listNewspaper();
        })
        .catch(() => {
          this.$toast.error("O'zgartirishda xatolik yuz berdi.")
        })
      }else{
        this.$toast.error('Davoimiyligi 12 ga bo\'lishuvchi son bo\'lishi kerak.')
      }
    },
    async updateListNewspaper(id){
        this.warningModal = true;
        this.pk = id;
        await this.$http.get(`payment/amount/${id}/`)
        .then(res => {
          this.editLoader = false;
          this.update = res.data;
          this.update.duration = ''+res.data.duration;
        })
        .catch(err => {
          console.log(err);
        })
    },
    // async searchNewspaper(){
    //   if(this.search){
    //     this.loader = false;
    //     await this.$http.get(`newspaper/search/?search=${this.search}`)
    //     .then(res => {
    //       if(res.data.results.length){
    //         this.loader = true;
    //         this.listing = res.data.results;
    //       }else{
    //         this.listNewspaper();
    //         this.$toast.error('Qidirilayotgan gazeta topilmadi.')
    //       }
    //     })
    //     .catch(() => {
    //       this.$toast.error('Qidirilayotgan gazeta topilmadi.')
    //     })
    //   }else{
    //     this.listNewspaper();
    //   }
    // },
    showTable(){
        this.buttonToggle = false;
        this.collapse = true;
    },
    async addNewspaper(){
      let calc = 0;
      this.form.duration = +this.form.duration;
      if(this.form.duration == 2 || this.form.duration == 3 || this.form.duration == 4 || this.form.duration == 6 || this.form.duration == 12){
        await this.$http.post('payment/amount/',this.form)
        .then(() => {
            this.form = {};
            this.collapse = false;
            this.$toast.success('Muvaffaqiyatli qo\'shildi.')
            this.buttonToggle = true;
            this.listNewspaper();
        })
        .catch(() => {
            this.$toast.error('Xatolik yuz berdi.')
        })
      }else{
        this.$toast.error('Davoimiyligi 12 ga bo\'lishuvchi son bo\'lishi kerak.')
      }
    },
    async listNewspaper(){
        this.loader = false;
        await this.$http.get('payment/amount/')
        .then(res => {
            this.loader = true;
            this.listing = res.data;
            // this.left = res.data.previous != null ? false : true;
            // this.next = res.data.next != null ? false : true;
        })
        .catch(err => {
            console.log(err);
        })
    },
  },
  mounted(){
      this.listNewspaper();
  }
}
</script>