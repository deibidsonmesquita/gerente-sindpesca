<script setup lang="ts">
import {Databases} from "appwrite";
import {client} from "~/utils/appwrite";
import {FilterMatchMode} from 'primevue/api';
import type Associacao from "~/models/Associacao";
import {DataBase} from "~/utils/DataBase";
import {useToast} from "primevue/usetoast";
import {ref} from "vue";

const visibleDialogDetalhes = ref(false);
const visibleDialogCadastro = ref(false);
const documentos = ref()
const associacaoSelected = ref<Partial<Associacao>>({})

const entidade = reactive<Partial<Associacao>>({})
const databases = new Databases(client)

const toast = useToast()

const promise = databases.listDocuments(
    DataBase,
    "65319d2e1978cd822d15");

onMounted(async () => {
  documentos.value = await promise.then((response) => {
    return response.documents
  }).catch((error) => {
    console.log(error);
  });
})

function deleteDocumento(documentoID: string) {
  console.log(documentoID)
  const promise = databases.deleteDocument(
      DataBase,
      "65319d2e1978cd822d15", documentoID);

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

function createDocumento() {
  try {
    databases.createDocument(
        DataBase,
        '65319d2e1978cd822d15',
        ID?.unique(), {
          CNPJ: entidade.CNPJ,
          CPF: entidade.CPF,
          Versao: entidade.Versao,
          DataLicenca: entidade.DataLicenca,
          Valor: entidade.Valor,
          Presidente: entidade.Presidente,
          Associacao: entidade.Associacao,
          HDDID: entidade.HDDID
        })

    showMensagem(
        'Cadastro efetuado com sucesso!',
        'success',
        'Dados salvos')

    visibleDialogCadastro.value = false
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
  <div class="p-1">
    <span class="font-medium text-700 uppercase">SindPesca Usuários Ativos - {{documentos.length}}</span>
    <Dialog v-model:visible="visibleDialogDetalhes" modal header="Detalhes" :style="{ width: '50vw' }">
      <div class="flex flex-wrap">
        <span class="mx-3 my-1 ">DATA LICENÇA: {{ associacaoSelected.DataLicenca }}</span>
        <span class="mx-3 my-1 font-medium">HDDID: {{ associacaoSelected.HDDID }}</span>
        <span class="mx-3 my-1">VERSÃO: {{ associacaoSelected.Versao }}.0</span>
        <span class="mx-3 my-1 ">PREÇO: {{ associacaoSelected.Valor }}</span>
      </div>
    </Dialog>

    <div class="flex gap-2 mt-2 w-full">

      <Button label="Adicionar Entidade"
              @click="visibleDialogCadastro = true"
              icon="pi pi-plus"
              size="small"
              class="my-2"/>
    </div>

    <DataTable v-model:filters="filters" tableStyle="min-width: 50rem"
               :value="documentos" paginator
               :rows="6" size="small"
               :globalFilterFields="['CNPJ', 'CPF', 'Presidente']">

      <template #header>
        <div class="flex justify-content-end">
            <span class="p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" placeholder="Search.."/>
            </span>
        </div>
      </template>
      <Column field="CNPJ" filterField="CNPJ" header="CNPJ"></Column>
      <Column field="CPF" header="CPF"></Column>
      <Column field="Presidente" header="Presidente"></Column>
      <Column field="Associacao" header="Entidade"></Column>
      <Column>
        <template class="white-space-nowrap" #body="slotProps">

          <Button @click="deleteDocumento(slotProps.data.$id)"
                  size="small"
                  severity="danger"
                  icon="pi pi-trash"/>

          <Button label="" @click="showDetalhes(slotProps.data)"
                  icon="pi pi-search"
                  size="small" class="ml-1"/>

        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="visibleDialogCadastro" modal header="Cadastro"
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
            <InputText class="w-full" type="number" v-model="entidade.Valor" placeholder="Valor"/>
            <InputText class="w-full" type="number" v-model="entidade.Versao" placeholder="Versão"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" v-model="entidade.HDDID" placeholder="HDDID"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" v-model="entidade.DataLicenca" placeholder="Data Licença"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" placeholder="Cidade"/>
          </div>
        </div>

        <Button @click="createDocumento"
                class="mt-2 w-full"
                size="small"
                label="Cadastrar entidade"/>
      </form>
    </Dialog>

  </div>
</template>
