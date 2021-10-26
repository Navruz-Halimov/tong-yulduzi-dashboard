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
                    label="Sarlavha"
                    v-model="form.title"
                    valid-feedback="Yaxshi :)"
                    invalid-feedback="Kamida bitta so'z kiriting."
                    :is-valid="validator"
                    required
                  />
                </CCol>
                <CCol md="12">
                    <div class="custom-file my-3">
                        <input @change="getFile" type="file" class="custom-file-input" id="validatedCustomFile" required>
                        <label ref="inputFile"  class="custom-file-label" for="validatedCustomFile">Gazeta yuklang...</label>
                    </div>
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
        <CCol md="10">
          <CInput
            placeholder="Sarlavha bo'yicha qidirish."
            v-model="search"
          />
        </CCol>
        <CCol md="2"> 
          <CButton color="primary" class="w-100 mb-3 mb-md-0" @click="searchNewspaper()">Qidirish</CButton>
        </CCol>
        <CCol md="5" class="mb-3">
          <CIcon name="cil-calendar" class="mr-3"/>
          <date-pick v-model="from" ></date-pick>
        </CCol>
        <CCol md="5" class="mb-3">
          <CIcon name="cil-calendar"  class="mr-3"/>
          <date-pick v-model="to"></date-pick>
        </CCol>
        <CCol md="2">
          <CButton color="primary" class="w-100" @click="searchNewspaperByCalendar()">Qidirish</CButton>          
        </CCol> 
        <CCol md="12">
          <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped table-light">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sarlavha</th>
                  <th>Sana</th>
                  <th>O'zgartirish</th>
                  <th>O'chirish</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(list,index) in listing" :key="index">
                  <td>
                    {{ list.pk }}
                  </td>
                  <td>
                    {{ list.title }}
                  </td>
                  <td>
                    {{ list.created_at.substr(0,10) }}
                  </td>
                  <td>
                    <button class="btn btn-warning mx-auto d-block" @click="updateListNewspaper(list.pk)">
                      O'zgartirish
                    </button>
                    <CModal
                      title="O'zgartirish"
                      color="warning"
                      :show.sync="warningModal"
                      :closeOnBackdrop="false"
                      v-if="list.pk == pk"
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
                            label="Sarlavha"
                            v-model="update.title"
                            valid-feedback="Yaxshi :)"
                            invalid-feedback="Kamida bitta so'z kiriting."
                            :is-valid="validator"
                          />
                        </CCol>
                        <CCol md="12">
                            <CInputFile
                                label="Gazeta fayli"
                                horizontal
                                custom
                                required
                                @change="updateFile"
                                ref="updateInputFile"
                                />
                        </CCol>
                      </CRow>
                      <div slot="footer">
                          <div slot="footer-wrapper">
                            <CButton class="btn btn-warning float-right" @click="saveUpdatedNewspaper(list.pk)">
                              Saqlash
                            </CButton>
                          </div>
                      </div>
                    </CModal>
                  </td>
                  <td>
                    <button class="btn btn-danger mx-auto d-block" @click="deleteNewspaper(list.pk)">
                      O'chirish
                    </button>
                    <CModal
                      title="O'chirmoqchimisiz?"
                      color="danger"
                      :show.sync="deleteHandler"
                      v-if="list.pk == deletePk"
                    > 
                    <h3>{{ list.title }}</h3>
                    <div slot="footer">
                        <div slot="footer-wrapper">
                            <CButton class="btn btn-danger mr-3" @click="deleteFile(list.pk)">
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
        form: {
            title: '',
            file: null,
        },
        update: {
          title: '',
          file: null,
        },
        from: null,
        to: '',
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
        validation: false,
    }
  },
  methods: {
    validator(val){
      return (val && val.length) > 0 ? true : false
     },
    getFile(event){
      this.$refs.inputFile.innerHTML = event.target.files[0].name;
        if(event && event.target.files[0].type == 'application/pdf'){
          this.form.file = event.target.files[0];
        }else{
          this.$toast.error('Faqat pdf formatda faylni yuklang.');
        }
    },
    updateFile(event){
        if(event && event.target.files[0].type == 'application/pdf'){
          this.clicked = true;
          this.validation = true;
          this.update.file = event.target.files[0];
        }else{
          this.validation = false;
          this.clicked = true;
          this.$toast.error('Faqat pdf formatda faylni yuklang.');
        }
    },
    deleteNewspaper(id){
      this.deletePk = id;
      this.deleteHandler = true;
    },
    async deleteFile(id){
      await this.$http.delete(`newspaper/${id}/`)
      .then(() => {
        this.$toast.success("Muvaffaqiyatli o'chirildi.")
        this.listNewspaper(0);
      })
      .catch(() => {
        this.$toast.error("O'chirishdada xatolik yuz berdi.")
      })
    },
    async saveUpdatedNewspaper(id){
      let formData = new FormData();
      if(this.clicked) {
        if(this.validation){
          formData.append('title',this.update.title);
          formData.append('file',this.update.file);
          await this.$http.patch(`newspaper/${id}/`,formData)
          .then(() => {
            this.$toast.success("Muvaffaqiyatli o'zgartirildi.")
            this.warningModal = false;
            this.clicked = false;
            this.update = {
              title: '',
              file: null,
            };
            // this.$refs['updateInputFile'].reset();
            this.listNewspaper(0);
          })
          .catch(() => {
            this.$toast.error("O'zgartirishda xatolik yuz berdi.")
          })
        }else{
            this.$toast.error("O'zgartirishda xatolik yuz berdi.")
        }
      }else{ 
        formData.append('title',this.update.title);
        await this.$http.patch(`newspaper/${id}/`,formData)
        .then(() => {
          this.$toast.success("Muvaffaqiyatli o'zgartirildi.")
          this.warningModal = false;
          this.clicked = false;
          this.update = {
            title: '',
            file: null,
          };
          // this.$refs['updateInputFile'].reset();
          this.listNewspaper(0);
        })
        .catch(() => {
          this.$toast.error("O'zgartirishda xatolik yuz berdi.")
        })
      }
      
    },
    async updateListNewspaper(id){
        this.warningModal = true;
        this.pk = id;
        await this.$http.get(`newspaper/${id}/`)
        .then(res => {
          this.editLoader = false;
          this.update = res.data;
        })
        .catch(err => {
          console.log(err);
        })
    },
    async searchNewspaperByCalendar(){
      if(this.from){
        this.loader = false;
        await this.$http.get(`newspaper/search/?date1=${this.from}&date2=${this.to}`)
        .then(res => {
          if(res.data.results.length){
            this.loader = true;
            this.listing = res.data.results;
          }else{
            this.listNewspaper(0);
            this.$toast.error('Qidirilayotgan gazeta topilmadi.')
          }
        })
        .catch(() => {
          this.$toast.error('Qidirilayotgan gazeta topilmadi.')
        })
      }else{
        this.loader = true;
        this.listNewspaper(0);
      }
    },
    async searchNewspaper(){
      if(this.search){
        this.loader = false;
        await this.$http.get(`newspaper/search/?search=${this.search}`)
        .then(res => {
          if(res.data.results.length){
            this.loader = true;
            this.listing = res.data.results;
          }else{
            this.listNewspaper(0);
            this.$toast.error('Qidirilayotgan gazeta topilmadi.')
          }
        })
        .catch(() => {
          this.$toast.error('Qidirilayotgan gazeta topilmadi.')
        })
      }else{
        this.listNewspaper(0);
      }
    },
    showTable(){
        this.buttonToggle = false;
        this.collapse = true;
    },
    async addNewspaper(){
        if(this.form.title && this.form.file){
          let formData = new FormData();
          formData.append('title',this.form.title);
          formData.append('file',this.form.file);
          await this.$http.post('newspaper/',formData)
          .then(() => {
              this.form = {};
              // this.$refs['inputFile'].reset();
              this.collapse = false;
              this.$toast.success('Muvaffaqiyatli qo\'shildi.')
              this.$refs.inputFile.innerHTML = "Gazeta yuklang."
              this.buttonToggle = true;
              this.listNewspaper(0);
          })
          .catch(() => {
              this.$toast.error('Xatolik yuz berdi.')
          })
        }else{
          this.$toast.error('Ma\'lumotlarni to\'liq kirgizing.')
        }
    },
    async listNewspaper(num){
        this.loader = false;
        this.sum = num == 0 ? this.sum : this.sum+num;
        await this.$http.get(`newspaper/?page=${this.sum}`)
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