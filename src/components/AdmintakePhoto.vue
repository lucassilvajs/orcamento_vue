<template>
	<div style="width:100%">
		<select  v-if="devices.length > 0" v-model="deviceId" name="" id="" class="d-none">
			<option v-for="device in devices" :value="device.deviceId" :key="device.deviceId">{{device.label.indexOf('front') >= 0 ? 'Camera Frontal' : 'Camera Traseira'}}</option>
		</select>
			<div class="target-foto">
			<img v-if="img && !hasImage" :src="img" alt="" style="width:100%;">

      <iframe v-if="hasImage" :src="img" frameborder="0" style="width:100%; height:400px"></iframe>
      <!-- <button type="button" class="btn btn-light btn-sm changeCam" @click="changeCamera" style="z-index:10;">
				<div class="glyph-icon iconsminds-arrow-around"></div>
			</button> -->
			<vue-web-cam v-if="!img" ref="web"
				:device-id="deviceId"
				@started="onStarted"
				@stopped="onStopped"
				@error="onError"
				@cameras="onCameras"
				@camera-change="onCameraChange"
			/>
			<div class="controlls">
				<div class="checkPicture" v-if="img">
					<button type="button" class="btn btn-danger mr-2" @click="img = false">
						<div class="d-inline glyph-icon simple-icon-dislike"></div>
						Tirar Outra
					</button>

					<b-button variant="success" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
                    	'show-spinner': processing,
                    	'show-success': !processing && uploadError===false,
                    	'show-fail': !processing && uploadError }" @click="sendImage">
						<span class="spinner d-inline-block">
							<span class="bounce1"></span>
							<span class="bounce2"></span>
							<span class="bounce3"></span>
						</span>
						<span class="icon success">
							<div class="d-inline glyph-icon simple-icon-like"></div> Gostei
						</span>
						<span class="icon fail">
							<i class="simple-icon-exclamation"></i>
						</span>
						<span class="label">Gostei</span>
					</b-button>
				</div>
				<button v-if="devices.length > 1" type="button" class="btn btn-outline-light" @click="changeCamera" style="z-index:10;">
					<div class="glyph-icon iconsminds-arrow-around"></div>
				</button>
				<button type="button" v-if="img" class="btn btn-outline-light mr-2" @click="img = false">
					<div class="glyph-icon simple-icon-trash"></div>
				</button>
				<button type="button" v-else class="btn btn-outline-light mr-2" @click="showCam">
					<div class="glyph-icon simple-icon-camera"></div>
				</button>
				<label class="btn btn-outline-light ml-2">
					<input type="file" @change="showPhoto" class="d-none">
					<div class="glyph-icon simple-icon-paper-clip"></div>
				</label>
			</div>
		</div>
	</div>
</template>

<script>
import { WebCam } from 'vue-web-cam';
import Compressor from 'compressorjs';
import {api, baseURL} from '@/constants/config';
export default {
	data(){
		return {
			img: null,
      camera: null,
      deviceId: null,
			devices: [],
			processing: false,
			uploadError: false,
      hasImage: false,
      fileObject: null,
		}
	},
	props: ["target", "sac"],
	components: {
    	'vue-web-cam': WebCam
	},
	name: 'take-photo',
	computed: {
        device: function() {
            return this.devices.find(n => n.deviceId === this.deviceId);
        }
    },
	methods: {
		showCam: function() {
      this.img = this.$refs.web.capture();
      this.fileObject = false;
		},
		onCapture() {
      this.img = this.$refs.webcam.capture();
      this.fileObject = false;
    },
    onStarted(stream) {
        console.log("On Started Event", stream);
    },
    onStopped(stream) {
        console.log("On Stopped Event", stream);
    },
    onStop() {
        this.$refs.webcam.stop();
    },
    onStart() {
        this.$refs.webcam.start();
    },
    onError(error) {
        console.log("On Error Event", error);
    },
    onCameras(cameras) {
        this.devices = cameras;
        console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
        this.deviceId = deviceId;
        this.camera = deviceId;
        console.log("On Camera Change Event", deviceId);
		},
		changeCamera() {
			this.deviceId = this.devices.filter(r => r.deviceId != this.deviceId)[0].deviceId;
		},
		showPhoto(e){
      this.fileObject = false;
			var file = new FileReader();
      file.onload = (el) => {
				this.img = el.target.result
      };
      this.fileObject = e.target.files[0];
      file.readAsDataURL(e.target.files[0]);
		},
		async sendImage() {
    	if(this.img.length > 100){
        this.processing = true;
        let file = '';
        let fileToCompress = null;
        let ext = '';
        if(this.fileObject){
          fileToCompress = this.fileObject
          ext = fileToCompress.type.split('/')[1];
        }else{
          var ImageURL = this.img;
          var block = ImageURL.split(";");
          // Get the content type of the image
          var contentType = block[0].split(":")[1];// In this case "image/gif"
          // get the real base64 content of the file
          var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

          ext = contentType.split('/')[1];
          // Convert it to a blob to upload
          ext = contentType.split('/')[1];
          var blob = this.b64toBlob(realData, contentType);
          fileToCompress = blob;
        }


        let fd = new FormData();
        if(fileToCompress.type.split('/')[0] == 'image'){
          let imageCompress = null;
          new Compressor(fileToCompress, {
            maxWidth: 1024,
            maxHeight:1024,
            quality: 0.7,
            success: async (result) => {
              fd.append('file', result, 'fileimage.'+ext);
              file = await api.post(`saveFile/${this.target}`, fd);
              if(file.data.status != 'success') {
          this.uploadError = true
          setTimeout(() => {
            this.uploadError = false
          }, 3500);
        }

        if(!this.sac){
          if(file.data.status == 'success') {
            let order = window.localStorage.getItem('order');
            if(order) {
              order = JSON.parse(order)
            }else{
              order = {};
            }

            order[this.target] = file.data.data;

            window.localStorage.setItem('order', JSON.stringify(order));
          }
        }

        if(!this.sac) {
          const redirect = this.target == 'face' ? 'recipe' : 'confirmation';
          this.$notify("success", "Sucesso", "Imagem salva com sucesso", {
            duration: 3000,
            permanent: false
          });
          this.$router.push(`/admin/make/${redirect}`);
        }

        if(this.sac) {
          console.log(file);
          this.$notify("success", "Sucesso", "Imagem salva com sucesso", {
            duration: 3000,
            permanent: false
          });

          window.localStorage.setItem('sac', file.data.data);
        }
        this.processing = false;
            }
          });
        }else{
          fd.append('file', fileToCompress, 'file.'+ext);
          file = await api.post(`saveFile/${this.target}`, fd);
          if(file.data.status != 'success') {
          this.uploadError = true
          setTimeout(() => {
            this.uploadError = false
          }, 3500);
        }

        if(!this.sac){
          if(file.data.status == 'success') {
            let order = window.localStorage.getItem('order');
            if(order) {
              order = JSON.parse(order)
            }else{
              order = {};
            }

            order[this.target] = file.data.data;

            window.localStorage.setItem('order', JSON.stringify(order));
          }
        }

        this.processing = false;
        if(!this.sac) {
            const redirect = this.target == 'face' ? 'recipe' : 'confirmation';
            this.$notify("success", "Sucesso", "Imagem salva com sucesso", {
              duration: 3000,
              permanent: false
            });
            this.$router.push(`/admin/make/${redirect}`);

          }
        }
      }else{
        const redirect = this.target == 'face' ? 'recipe' : 'confirmation';
        this.$router.push(`/admin/make/${redirect}`);

      }
    },
		checkImg() {
			let order = window.localStorage.getItem('order');
			if(order){
				order = JSON.parse(order);
				if(order[this.target]) {
					this.img = baseURL+order[this.target]
				}
			}
    },
    changeCam(){
      setTimeout(() => {
        if(this.devices.length > 1){
          this.changeCamera();
        }
      }, 2000);
    },
    b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }


            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }
	},
	watch: {
        camera: function(id) {
            this.deviceId = id;
        },
        devices: function() {
            const [first, ...tail] = this.devices;
            if (first) {
                this.camera = first.deviceId;
                this.deviceId = first.deviceId;
            }
        },
        img: function(ima) {
          this.hasImage = false;
          console.log(ima.split(';')[0]);
          let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
          console.log(existe)
          this.hasImage = !existe.length
        }
	},
	created() {
    this.checkImg();
    this.changeCam();
	}
}
</script>

<style scoped>
	.target-foto {
		max-width:500px;
		display: block;
		margin: 0 auto;
		background: #333;
		position: relative;
	}

	.controlls {
		width: 100%;
		height: 65px;
		background: #00b3b7;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto 20px auto;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		align-items: center
	}

	.checkPicture{
		position: absolute;
		bottom:100px;
	}

	.changeCam {
		position: absolute;
		font-size: 1.125em;
		right:15px;
		top:15px;
	}
</style>
