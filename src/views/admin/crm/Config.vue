<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>CRM - Configurações</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
</div>
</template>

<script>

import {api, baseURL, firebaseConfig} from '@/constants/config';


export default {
    components: {

    },
    data() {
      return {
      }
    },
    methods:{
    },
    created(){
    }
}
</script>

<style scoped>

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

.tag-label {
  padding: 3px 8px;
  border:1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  display: block;

}

.tag-label button {
  padding: 3px;
  background: transparent;
  border: 0;
  float: right;
}

.status-item {
    padding: 8px;
    background: #eee;
}

.title-active{
  font-size: 1rem;
}

span.time {
    font-size: .75rem;
    color: #aaa;
}

.description {
    margin-left: calc(1rem + 28px);
    border: 1px solid #aaa;
    padding: 10px;
    font-weight: bold;
    color: #aaa;
}

.status-item.success {
  background: #afa;
  color: #363;
}

.status-item.info {
  background: #4ad;
  color: #059;
}

.status-item.warning {
  background: #ff5;
  color: #990;
}

.status-item.danger {
  background: #faa;
  color: #633;
}

a:not(.collapsed) {
  color: #00b3b7!important;
}

.comments .profile {
  border-radius: 50%;

}

.comments h3 {
  font-size: 1rem;
}

.comments .description {
  background: #efefef;
  color: #466;
}

.description-info {
  font-size: .7rem;
  margin-top: 15px;
  color: #899;
}

.text-area {
  width: 100%;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  background: #efefef;
  justify-content: space-between;
}

.text-area input {
  height: 50px;
  border: 0;
  width: 85%;
  padding: 5px 10px;
}

.text-area button {
  border-radius: 50%;
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.comments-area {
  max-height: 40vh;
  overflow: scroll;
}

/* Load */
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 39px;
    left: 3px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 14px;
    left: -22px;
    width: 50px;
    height: 50px;
    opacity: 0;
  }
}


span.label {
  font-size: 1rem;
  display: block;
  color: #555;
}

span.value{
  color: #999;
  font-size: 1rem;
}

div.edit {
  display: none;
}

.btn-edit {
  display: none;
}

span.label:hover div.edit, span.label:hover .btn-edit{
  display: inline-block;
}

.link.value {
  color: #00b3b7;
  text-decoration: underline;
  cursor: pointer;
}

.color-label {
    width: 20px;
    height: 20px;
    display: inline-block;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
