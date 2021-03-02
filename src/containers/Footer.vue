<template>
<div>
    <div class="load-generic d-none justify-content-center align-items-center">
        <h1>Carregando</h1>
    </div>
    <footer class="page-footer">
        <div class="footer-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <p class="mb-0 text-muted">Eye Measure © IDSafety 2020</p>
                        <img class="mx-2" style="width:160px;" src="https://test.idsafety.com.br/assets/img/eye-measure.png" alt="">
                        <img class="mx-2" style="width:100px;" src="https://test.idsafety.com.br/assets/img/logo.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div>
</template>
<script>
export default {

}
</script>

<style>
.load-generic{
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, .7);
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
}
</style>
