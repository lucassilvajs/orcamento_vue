<template>
<nav class="navbar fixed-top">
    <div class="d-flex align-items-center navbar-left">
        <a href="#" class="menu-button d-none d-md-block" @click.prevent="changeSideMenuStatus({step :menuClickCount+1,classNames:menuType,selectedMenuHasSubItems})">
            <menu-icon />
        </a>
        <a href="#" class="menu-button-mobile d-xs-block d-sm-block d-md-none" @click.prevent="changeSideMenuForMobile(menuType)">
            <mobile-menu-icon />
        </a>

        <div v-if="true" class="header-icons d-inline-block align-middle">
                            <b-modal id="modalbackdrop" ref="modalbackdrop" size="lg" title="Seus pedidos pendentes">
            <table class="table">
              <thead>
                <tr>
                  <th>Enviar</th>
                  <th>Colaborador</th>
                  <th>Empresa</th>
                  <th>CNPJ</th>
                  <th>Produto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(n, i) in awaitingOrders" :key="i">
                  <td>
                    <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                      <div class="itemCheck mb-0 custom-control custom-checkbox">
                        <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="n.item" :id="`check_${n.id}`">
                        <label class="custom-control-label" :for="`check_${n.id}`"></label>
                      </div>
                    </div>
                  </td>
                  <td>{{n.name}}</td>
                  <td>{{n.company}}</td>
                  <td>{{n.cnpj}}</td>
                  <td>{{n.product}}</td>
                </tr>
              </tbody>
            </table>
            <template slot="modal-footer">
                          <b-button variant="primary" :disabled="processing" :class="{'btn-multiple-state btn-shadow ml-3': true,
                'show-spinner': processing,
                'show-success': !processing}" @click="sendUserOrder">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    Enviar
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">Enviar</span>
            </b-button>
                <b-button variant="secondary" @click="hideModal('modalbackdrop')">Fechar</b-button>
            </template>
        </b-modal>
            <div class="position-relative d-inline-block" v-if="awaitingOrders">
                <b-dropdown variant="empty" size="sm" right toggle-class="header-icon notificationButton" menu-class="position-absolute mt-3 notificationDropdown" no-caret>
                    <template slot="button-content">
                        <i class="simple-icon-bell" />
                        <span v-if="awaitingOrders && awaitingOrders.length > 0" class="count">{{awaitingOrders.length > 0 ? 1 : 0}}</span>
                    </template>
                    <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }">
                        <div v-if="awaitingOrders.length > 0">
                          <div v-b-modal.modalbackdrop class="d-flex flex-row mb-3 pb-3 border-bottom align-items-center cursor-pointer">
                              <div>
                                  <img :src="`https://api.idsafety.com.br/${awaitingOrders[0].attr.image}`" :alt="awaitingOrders[0].attr.lens[0].name" class="img-thumbnail list-thumbnail xsmall border-0 rounded-circle" />
                              </div>
                              <div class="pl-3 pr-2">
                                  <div>
                                      <p class="font-weight-medium mb-1">Você possui {{awaitingOrders.length == 1 ? '1 proposta' : awaitingOrders.length + ' propostas'}}  aguardando envio</p>
                                  </div>
                              </div>
                              <!-- <div class="delete-btn" @click="deleteAwaitingOrder">x</div> -->
                          </div>
                        </div>
                        <div v-else class="h-100 text-center d-flex align-items-center justify-content-center">
                          <h3>Você não possui nenhuma notificação</h3>
                        </div>
                    </vue-perfect-scrollbar>
                </b-dropdown>
            </div>
            <div class="position-relative d-none d-sm-inline-block ">
                <div class="btn-group">
                    <b-button variant="empty" class="header-icon btn-sm" @click="toggleFullScreen">
                        <i :class="{'d-inline-block':true,'simple-icon-size-actual':fullScreen,'simple-icon-size-fullscreen':!fullScreen }" />
                    </b-button>
                </div>
            </div>
        </div>
    </div>
    <router-link class="navbar-logo" tag="a" to="/app">
        <span class="logo d-none d-xs-block"></span>
        <span class="logo-mobile d-block d-xs-none"></span>
    </router-link>

    <div class="navbar-right">

        <div class="user d-inline-block">
            <b-dropdown class="dropdown-menu-right" right variant="empty" toggle-class="p-0" menu-class="mt-3" no-caret>
                <template slot="button-content">
                    <span class="name mr-1">{{currentUser.user.name}} - {{currentUser.user.company_name.split('-')[0]}}</span>
                    <span>
                        <img v-if="currentUser.user.logo.indexOf('http') >= 0" :alt="currentUser.user.title" :src="`${currentUser.user.logo}`" />
                    </span>
                </template>
                <!-- <b-dropdown-item>Configurações</b-dropdown-item> -->
                <b-dropdown-divider />
                <b-dropdown-item @click="logout">Sair</b-dropdown-item>
            </b-dropdown>
        </div>
    </div>
</nav>
</template>

<script>
import Switches from 'vue-switches'
import notifications from '../data/notifications'

import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'
import {
    MenuIcon,
    MobileMenuIcon
} from '../components/Svg'
import {
    searchPath,
    menuHiddenBreakpoint,
    localeOptions,
    buyUrl,
    defaultColor
} from '../constants/config'
import {
    getDirection,
    setDirection
} from '../utils'
export default {
    components: {
        'menu-icon': MenuIcon,
        'mobile-menu-icon': MobileMenuIcon,
        'switches': Switches
    },
    data() {
        return {
            selectedParentMenu: '',
            searchKeyword: '',
            isMobileSearch: false,
            isSearchOver: false,
            fullScreen: false,
            menuHiddenBreakpoint,
            searchPath,
            localeOptions,
            buyUrl,
            notifications,
            isDarkActive: false,
            processing: false
        }
    },
    methods: {
        ...mapMutations(['changeSideMenuStatus', 'changeSideMenuForMobile']),
        ...mapActions(['setLang', 'signOut', 'getAwaitingOrders', 'sendOrdersAwaiting', 'sendAwaitingOrders']),
        async sendUserOrder(){
          const items = this.awaitingOrders.filter(r => r.item);
          if(items.length > 0) {
            this.processing = true;
            await this.sendAwaitingOrders({items})
            await this.getAwaitingOrders();
            this.processing = false;
            this.hideModal('modalbackdrop')
            this.$notify("success", 'Sucesso', 'Suas propostas foram enviadas com sucesso.', {
              duration: 3000,
              permanent: false
            });
          }else{
            this.$swal.fire({
              title: `Você esqueceu algo!`,
              text: `Por favor, selecione pelo menos um pedido para continuar`,
              icon: 'error'
            });
          }
        },
        search() {
            this.$router.push(`${this.searchPath}?search=${this.searchKeyword}`)
            this.searchKeyword = ''
        },
        searchClick() {
            if (window.innerWidth < this.menuHiddenBreakpoint) {
                if (!this.isMobileSearch) {
                    this.isMobileSearch = true
                } else {
                    this.search()
                    this.isMobileSearch = false
                }
            } else {
                this.search()
            }
        },
        handleDocumentforMobileSearch() {
            if (!this.isSearchOver) {
                this.isMobileSearch = false
                this.searchKeyword = ''
            }
        },

        changeLocale(locale, direction) {
            const currentDirection = getDirection().direction
            if (direction !== currentDirection) {
                setDirection(direction)
            }

            this.setLang(locale)
        },
        logout() {
            this.signOut().then(() => {
                this.$router.push('/login')
            })
        },

        toggleFullScreen() {
            const isInFullScreen = this.isInFullScreen()

            var docElm = document.documentElement
            if (!isInFullScreen) {
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen()
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen()
                } else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen()
                } else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen()
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
            }
            this.fullScreen = !isInFullScreen
        },
        getThemeColor() {
            return localStorage.getItem('themeColor') ?
                localStorage.getItem('themeColor') :
                defaultColor
        },
        isInFullScreen() {
            return (
                (document.fullscreenElement && document.fullscreenElement !== null) ||
                (document.webkitFullscreenElement &&
                    document.webkitFullscreenElement !== null) ||
                (document.mozFullScreenElement &&
                    document.mozFullScreenElement !== null) ||
                (document.msFullscreenElement && document.msFullscreenElement !== null)
            )
        },
        hideModal (refname) {
          this.$refs[refname].hide()
          console.log('hide modal:: ' + refname)

          if (refname === 'modalnestedinline') {
            this.$refs['modalnested'].show()
          }
        },
    },
    computed: {
        ...mapGetters({
            currentUser: 'currentUser',
            menuType: 'getMenuType',
            menuClickCount: 'getMenuClickCount',
            selectedMenuHasSubItems: 'getSelectedMenuHasSubItems',
            awaitingOrders: 'awaitingOrders'
        })
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleDocumentforMobileSearch)
    },
    created() {
        const color = this.getThemeColor()
        this.isDarkActive = color.indexOf('dark') > -1
        this.getAwaitingOrders();
    },
    watch: {
      // awaitingOrders(){
        // this.getAwaitingOrders();
      // },
        '$i18n.locale'(to, from) {
            if (from !== to) {
                this.$router.go(this.$route.path)
            }
        },
        isDarkActive(val) {
            let color = this.getThemeColor()
            let isChange = false
            if (val && color.indexOf('light') > -1) {
                isChange = true
                color = color.replace('light', 'dark')
            } else if (!val && color.indexOf('dark') > -1) {
                isChange = true
                color = color.replace('dark', 'light')
            }
            if (isChange) {
                localStorage.setItem('themeColor', color)
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            }
        },
        isMobileSearch(val) {
            if (val) {
                document.addEventListener('click', this.handleDocumentforMobileSearch)
            } else {
                document.removeEventListener(
                    'click',
                    this.handleDocumentforMobileSearch
                )
            }
        }
    }
}
</script>

<style>
.delete-btn {
  width: 22px;
  height: 22px;
  border: 2px solid;
  color: rgb(221, 0, 0);
  font-weight: bold;
  text-align: center;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
