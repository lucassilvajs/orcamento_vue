<template>
    <div class="target-foto">			
        <vue-web-cam />
		<!-- <div class="controlls">
            <div>
                <button class="btn btn-outline-dark btn-sm mr-1"> - </button>
                <button class="btn btn-outline-dark btn-sm"> + </button>
            </div>
            <button class="btn btn-outline-light mr-2">
                <div class="glyph-icon simple-icon-camera"></div>
            </button>
            <button class="btn btn-outline-light ml-2">
                <div class="glyph-icon simple-icon-paper-clip"></div>
            </button>
        </div> -->
    </div>
</template>

<script>
import WebCam from 'vue-web-cam';

export default {
	components: {
    	'vue-web-cam': WebCam
	},
    name: 'take-photo',
}
</script>

<style scoped>
	.target-foto {
		width:500px;
		height:500px;
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
</style>