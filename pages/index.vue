<script setup lang="ts">

const route = useRouter()
const usuario = ref({
  login: "",
  senha: "",
})

function efetuarlogin() {
  if (usuario.value.login === 'sindpesca' && usuario.value.senha === 'sindpesca123') {
    route.push({path: 'home', replace: true})
  } else {
    alert('Login incorreto')
  }
}


const {data: ufs} = await useFetch('https://gdm.vps-kinghost.net:8443/entidade/ufs/all')
console.log(ufs.value)
</script>

<template>
  {{ufs}}
  <div class="h-3rem bg-blue-400 gap-2 flex align-items-center p-2 text-white">
    <img src="/cherry.png" alt="cherry" width="24" height="24"/>
    <span class="font-semibold uppercase"> Gerenciador SindPesca</span>
  </div>
  <div class="flex justify-content-center md:p-8 p-6">
    <div class="flex gap-2 w-full max-w-30rem flex-column">
      <p class="font-bold uppercase text-blue-400">Gerenciador - Login</p>
      <InputText class="w-full" v-model="usuario.login" placeholder="Login"/>
      <InputText type="password" class="w-full" v-model="usuario.senha" placeholder="Password"/>
      <Button label="Entrar" @click="efetuarlogin"/>
      <span></span>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
}
</style>