<template>
	<div style="width:100%">
		<select  v-if="devices.length > 0" v-model="deviceId" name="" id="" class="d-none">
			<option v-for="device in devices" :value="device.deviceId" :key="device.deviceId">{{device.label.indexOf('front') >= 0 ? 'Camera Frontal' : 'Camera Traseira'}}</option>
		</select>
			<div class="target-foto">
			<img v-if="img" :src="img" alt="" style="width:100%;">
			<!-- <button class="btn btn-light btn-sm changeCam" @click="changeCamera" style="z-index:10;">
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
					<button class="btn btn-danger mr-2" @click="img = false">
						<div class="d-inline glyph-icon simple-icon-dislike"></div>
						Tirar Outra
					</button>
					<button class="btn btn-success mr-2" @click="sendImage">
						Gostei
						<div class="d-inline glyph-icon simple-icon-like"></div>
					</button>
				</div>			
				<button class="btn btn-outline-light" @click="changeCamera" style="z-index:10;">
					<div class="glyph-icon iconsminds-arrow-around"></div>
				</button>
				<button v-if="img" class="btn btn-outline-light mr-2" @click="img = false">
					<div class="glyph-icon simple-icon-trash"></div>
				</button>
				<button v-else class="btn btn-outline-light mr-2" @click="showCam">
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
import Compress from 'compress.js';
import {api} from '@/constants/config';
export default {
	data(){
		return {
			img: null,
            camera: null,
            deviceId: null,
            devices: []
			
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
		},
		onCapture() {
            this.img = this.$refs.webcam.capture();
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
			var file = new FileReader();
            file.onload = (el) => {
				this.img = el.target.result
			};
            file.readAsDataURL(e.target.files[0]);
		},
		async sendImage() {
			if(this.img.length > 100){
				const file = await api.post(`saveFile/${this.target}`, {
					image: this.img
				});

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
	
			}

			if(!this.sac) {
				const redirect = this.target == 'face' ? 'recipe' : 'confirmation';
				this.$notify("success", "Sucesso", "Imagem salva com sucesso", {
					duration: 3000,
					permanent: false
				});
				this.$router.push(`/order/${redirect}`);
			}

			if(this.sac) {
				window.localStorage.setItem('sac', file.data.data);
			}
		},
		checkImg() {
			let order = window.localStorage.getItem('order');
			if(order){
				order = JSON.parse(order);
				if(order[this.target]) {
					this.img = 'http://localhost/orcamento_api/'+order[this.target]
				}
			}
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
        }
	},
	created() {
		this.checkImg()
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