<script setup lang="ts">
import {Databases} from "appwrite";
import {client} from "~/utils/appwrite";
import {FilterMatchMode} from 'primevue/api';
import type Associacao from "~/models/Associacao";
import {DataBaseID, tabelaID} from "~/utils/DataBaseID";
import {useToast} from "primevue/usetoast";
import {ref} from "vue";

const visibleDialogDetalhes = ref(false);
const visibleDialogCadastro = ref(false);
const documentos = ref()
const associacaoSelected = ref<Partial<Associacao>>({})

const entidade = reactive<Partial<Associacao>>({})
const databases = new Databases(client)

const toast = useToast()

const promise = databases.listDocuments(DataBaseID, tabelaID);

onMounted(async () => {
  documentos.value = await promise.then((response) => {
    return response.documents
  }).catch((error) => {
    console.log(error);
  });
})

function deleteDocumento(documentoID: string) {
  console.log(documentoID)
  const promise = databases.deleteDocument(DataBaseID, tabelaID, documentoID);

  promise.then(function (response) {
    showMensagem(
        'Dados apagados com sucesso!',
        'success',
        'Dados salvos')

  }, function (error) {
    showMensagem(
        'Houve um erro e não foi possível apagar os dados',
        'error',
        error
    )
  });
}

async function createDocumento() {
  try {

    if(entidade.HDDID && entidade.CNPJ) {
      await databases.createDocument(DataBaseID, tabelaID,
          ID?.unique(), {
            CNPJ: entidade.CNPJ,
            CPF: entidade.CPF,
            Versao: entidade.Versao,
            DataLicenca: entidade.DataLicenca.toLocaleDateString("pt-BR"),
            Valor: entidade.Valor,
            Presidente: entidade.Presidente,
            Associacao: entidade.Associacao,
            HDDID: entidade.HDDID,
            cidade: entidade.cidade,
            mac: entidade.mac
          }).catch((error) => {
        console.log(error)
      })

      showMensagem(
          'Cadastro efetuado com sucesso!',
          'success',
          'Dados salvos')

      visibleDialogCadastro.value = false
    }
  } catch (e) {
    showMensagem(
        'Houve um erro e não foi possível salvar os dados',
        'error', e)
  }
}

function showDetalhes(associacao: any) {
  visibleDialogDetalhes.value = true
  associacaoSelected.value = associacao
}

const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS}
})

const showMensagem = (mensagem: string, tipo: any, detail: string | any) => {
  toast.add({
    severity: tipo,
    summary: mensagem,
    detail: detail, life: 3500
  });
};

</script>

<template>
  <Toast/>
  <div class="h-3rem bg-blue-400 flex align-items-center p-2 text-white">
    <span>:: Gerenciador SindPesca</span>
  </div>
  <div class="flex p-2 flex-column">


    <Dialog v-model:visible="visibleDialogDetalhes" modal header="Detalhes" :style="{ width: '75vw' }">
      <div class="flex flex-wrap">
        <span class="mx-3 my-1 ">DATA LICENÇA: {{ associacaoSelected.DataLicenca }}</span>
        <span class="mx-3 my-1 font-medium">HDDID: {{ associacaoSelected.HDDID }}</span>
        <span class="mx-3 my-1 ">MAC: {{ associacaoSelected.MAC }}</span>
        <span class="mx-3 my-1">VERSÃO: {{ associacaoSelected.Versao }}.0</span>
        <span class="mx-3 my-1 ">PREÇO: {{ associacaoSelected.Valor }}</span>
      </div>
    </Dialog>

    <div class="flex gap-2 mb-2 w-full align-items-center justify-content-between">

      <Button label="Adicionar Entidade"
              @click="visibleDialogCadastro = true"
              icon="pi pi-plus" size="small"
              class="my-2 w-full md:w-3"/>

      <span class="font-medium text-700 text-xs uppercase">
        SindPesca Usuários Ativos: {{ documentos?.length || 0 }}
      </span>
    </div>

    <DataTable v-model:filters="filters" tableStyle="min-width: 50rem"
               :value="documentos" paginator
               :rows="8" size="small"
               :globalFilterFields="['CNPJ', 'CPF', 'Presidente']">

      <template #header>
        <div class="flex justify-content-end">
            <span class="p-input-icon-left flex align-items-center gap-1 w-full md:w-3">
                <InputText class="w-full" v-model="filters['global'].value" placeholder="Procurar.."/>
               <i class="pi pi-search"/>
            </span>
        </div>
      </template>
      <Column field="CNPJ" filterField="CNPJ" header="CNPJ"></Column>
      <Column field="CPF" header="CPF"></Column>
      <Column field="Presidente" header="Presidente"></Column>
      <Column field="cidade" header="Cidade"></Column>
      <Column field="mac" header="MAC"></Column>
      <Column field="HDDID" header="HDID"></Column>
      <Column field="DataLicenca" header="Data"></Column>
      <Column>
        <template #body="slotProps">
          <div class="white-space-nowrap">
            <Button @click="deleteDocumento(slotProps.data.$id)"
                    size="small"
                    severity="danger"
                    icon="pi pi-trash"/>

            <Button label="" @click="showDetalhes(slotProps.data)"
                    icon="pi pi-search"
                    size="small" class="ml-1"/>
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="visibleDialogCadastro" modal header="Cadastro Entidades"
            :breakpoints="{ '960px': '75vw', '641px': '95vw' }"
            :style="{ width: '50vw' }">

      <form method="post">
        <div class="gap-2 flex flex-wrap">
          <div class="flex w-full">
            <InputText class="w-full" v-model="entidade.Associacao" placeholder="Nome Entidade"/>
          </div>
          <div class="flex w-full">
            <InputText class="w-full" v-model="entidade.CNPJ" placeholder="CNPJ"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" v-model="entidade.Presidente" placeholder="Presidente"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" v-model="entidade.CPF" placeholder="CPF"/>
          </div>

          <div class="flex gap-2 w-full">
            <InputNumber input-class="w-full" type="number" v-model="entidade.Valor" placeholder="Valor"/>
            <InputNumber input-class="w-full" :min="0" :max="100" :minFractionDigits="2" v-model="entidade.Versao" placeholder="Versão"/>
          </div>

          <div class="flex gap-2 w-full">
            <InputText class="w-full" v-model="entidade.HDDID" placeholder="HDDID"/>
            <InputText class="w-full" v-model="entidade.mac" placeholder="MAC"/>
          </div>

          <div class="flex gap-2 w-full">
            <Calendar class="w-full w-6" dateFormat="dd/mm/yy" showIcon fluid v-model="entidade.DataLicenca"
                      placeholder="Data Licença"/>
            <Calendar class="w-full w-6" placeholder="expiração" dateFormat="dd/mm/yy"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" placeholder="Cidade" v-model="entidade.cidade"/>
          </div>
        </div>

        <Button @click="createDocumento"
                class="mt-2 w-full"
                label="Cadastrar entidade"/>
      </form>
    </Dialog>

  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
}
</style>
