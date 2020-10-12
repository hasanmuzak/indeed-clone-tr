Vue.use(window.vuelidate.default)
const {
    required,
    email,
    minLength
} = window.validators

var home = new Vue({
    el: '#app',
    delimiters: ['<%', '%>'],
    data() {
        return {
            findJob: {
                filterData: '',
                cityData: '',
                email: '',
                password: '',
                cityDataArray: ['Adana', 'Adıyaman', 'Afyon', 'Ağrı', 'Amasya', 'Ankara', 'Antalya',
                    'Artvin',
                    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
                    'Çanakkale',
                    'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
                    'Erzurum', 'Eskişehir',
                    'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
                    'Istanbul', 'Izmir',
                    'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya',
                    'Kütahya', 'Malatya',
                    'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu',
                    'Rize', 'Sakarya',
                    'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
                    'Şanlıurfa', 'Uşak',
                    'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale',
                    'Batman', 'Şırnak',
                    'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
                ],
                filterDataArray: ['Node.js', 'Java', 'Vue.js', 'Django',
                    'Python', 'Javascript', 'React', 'FullStack Developer',
                    'Frontend Developer', 'Ruby'
                ],
            },
            email: null,
            show:false,
            registerEmployer:false,
            password: null,
            current: 1,
            radio_data : 'on',
            deleteModal : false,
            user: {
                hasExperience:false,
                personal: {
                    first_name: null,
                    last_name: null,
                    location: '',
                    phoneNumber: null,
                    show_num: false,
                },
                education: {
                    education_level: null,
                    graduated_school: null,
                    department: null,
                    school_location: '',
                    still_student: false,
                    school_start_month: null,
                    school_start_year: null,
                    school_end_month: null,
                    school_end_year: null
                },
                experience : {
                    position : null,
                    company : null,
                    location : '',
                    still_in_company : false,
                    start_month: null,
                    start_year: null,
                    end_month: null,
                    end_year: null
                },
                experienceList : [],
                skill : {
                    skill : null,
                    list : [],
                    skillHiddenValue : ''
                }
            }
        }
    },
    methods: {
        toggleClassFunc: function () {
            var menu = document.querySelector('.links-container')
            var hamburger = document.querySelector('.hamburger')
            hamburger.classList.toggle('active')
            menu.classList.toggle('active')
        },
        filterMethod(value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        },
        next() {
            if (this.current != 5) {
                this.current++;
            }
        },
        prev() {
            if (this.current != 1) {
                this.current--;
            }
        },
        addSkill(){
            const ifExist = this.user.skill.list.includes(this.user.skill.skill);
            if(ifExist == false && this.user.skill.skill !== null){
                console.log(this.user.skill.skill);
                this.user.skill.list.push(this.user.skill.skill);
            }
            this.user.skill.skillHiddenValue = '';
            for (let index = 0; index < this.user.skill.list.length; index++) {
                if(index == this.user.skill.list.length-1){
                    this.user.skill.skillHiddenValue += `${this.user.skill.list[index]}`;
                }
                else{
                    this.user.skill.skillHiddenValue += `${this.user.skill.list[index]}, `;
                }
            }
        },
        deleteSkill(){
            this.user.skill.list = []
            this.user.skill.skillHiddenValue = null;
        },
        saveExperience(){
            this.user.experienceList.push(Object.assign({}, this.user.experience));
            this.user.experience.position = null;
            this.user.experience.location = '';
            this.user.experience.company = null;
            this.user.experience.still_in_company = false;
            this.user.experience.start_month = null;
            this.user.experience.start_year = null;
            this.user.experience.end_month = null;
            this.user.experience.end_year = null;
        },
        resetExperience(){
            this.user.experienceList = []
        },
        validateEducation(){
            if(this.user.still_student == false){
                return true;
            }
            else{
                return false;
            }
        },
        error (nodesc) {
            this.$Notice.config({
                duration: 3
            });
            
            this.$Notice.open({
                title: 'Hata',
                desc: nodesc ? '' : "Maalesef bu özellik şuan için yapılandırılmadı."
            });
        },
    },
    mounted() {
        this.validateEducation();
    },
    validations: {
        email: {
            required,
            email
        },
        password: {
            required,
            minLength: minLength(8)
        }
    },
});