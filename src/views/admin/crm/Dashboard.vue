<template>
<div>
    <b-row class="mb-3">
      <b-colxx>
        <b-card>
          <b-row class="align-items-center justify-content-between">
            <b-colxx xl="3" xs="12">
              <div class="d-block d-md-inline-block pt-1 w-100">
                  <div class="search-sm d-inline-block float-md-left mr-1 align-top w-100">
                      <b-input placeholder="Buscar" v-model="search" />
                  </div>
              </div>
            </b-colxx>
            <b-colxx xl="3" xs="12">
              <b-button @click="addPipe" class="float-right" variant="outline-success"> <div class="glyph-icon simple-icon-plus"/> </b-button>
            </b-colxx>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row class="flex-nowrap h-100">

      <b-colxx md="3" v-for="(p, indexPipe) in pipe" :key="indexPipe">
        <b-card class="full-height p-3" no-body>
          <b-card-header class="d-flex justify-content-between align-items-start">
            <h6 class="title">{{p.name}}</h6>

            <div class="text-right">
              <span class="badge badge-info">{{p.cards.length}}</span>
            </div>

          </b-card-header>
          <b-card-body class="p-1 card-area">
            <draggable :list="p.cards" :group="{ name: 'people'}" style="height:100%;">
                  <card class="mt-2 mb-3 p-3" :pipe="c" v-for="(c, cIndex) in p.cards" :key="cIndex" />
            </draggable>
          </b-card-body>
        </b-card>
      </b-colxx>
    </b-row>
</div>
</template>

<script>

import {api, baseURL, firebaseConfig} from '@/constants/config';
import { generateChart } from 'vue-chartjs';
import Firebase from 'firebase';

import Card from '@/components/Crm/Card'
import Draggable from 'vuedraggable'

export default {
    components: {
      'draggable': Draggable,
      'card': Card,
    },
    data() {
      return {
        pipe: {},
        search: '',
      }
    },
    methods:{
      startFirebase() {
        setTimeout(() => {
          console.log('snapshot')
          Firebase.initializeApp(firebaseConfig);
          var database = Firebase.database().ref('/');
          database.on('value', (snapshot) => {
            this.pipe = snapshot.val()
            console.log('snapshot.val()')
          });
        }, 1000);
      },
      addPipe() {
        let obj = {
          "creator": 5,
          "assign": [1],
          "items": [
              {
                  "label": "Nome da empresa",
                  "value": "Marchesan"
              },
              {
                  "label": "Região",
                  "value": "São Paulo"
              },
              {
                  "label": "CNPJ",
                  "value": "441.754.508/0001-24"
              }
          ],
          "added": new Date(),
          "comment": [],
          "historic": [
              {
                  "title": "Card criado",
                  "color": "success",
                  "icon": "simple-icon-plus",
                  "description": "O card foi criado.",
                  "user": 5,
                  "added": new Date()
              },
          ]}
        this.pipe[0].cards.push(obj);

          Firebase.database().ref('0/cards/').push(obj, function(error) {
              if (error) {
                // The write failed...
                console.log(error)
              } else {
                // Data saved successfully!
              }
            });

      }
    },
    created(){
      this.startFirebase()
    }
}
</script>

<style>

.painel {
  flex-wrap: nowrap;
}

.full-height {
  height: calc(100vh - 130px);
}

::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #aaa;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.card-area {
  overflow: auto;
}
</style>
