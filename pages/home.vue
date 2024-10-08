<script setup lang="ts">
import {Databases} from "appwrite";
import {client} from "~/utils/appwrite";
import {FilterMatchMode} from 'primevue/api';
import type Associacao from "~/models/Associacao";
import {DataBaseID, tabelaID} from "~/utils/DataBaseID";
import {useToast} from "primevue/usetoast";
import {ref} from "vue";

import {useWindowSize} from '@vueuse/core'

const {height} = useWindowSize()

const visibleDialogDetalhes = ref(false);
const visibleDialogCadastro = ref(false);
const documentos = ref()
const associacaoSelected = ref<Partial<Associacao>>({})

let entidade = reactive<Partial<Associacao>>({})
const databases = new Databases(client)

const toast = useToast()
const route = useRouter()

onMounted(async () => {await loadUpdate()})

async function loadUpdate() {
  const response = await databases.listDocuments(DataBaseID, tabelaID)
  documentos.value = response.documents
}

async function uptateDocumento() {
  if (associacaoSelected.value.Associacao && associacaoSelected.value.HDDID) {
    await databases.updateDocument(
        DataBaseID,
        tabelaID,
        associacaoSelected.value.$id as string,
        {
          'DataLicenca': associacaoSelected.value.DataLicenca,
          'HDDID': associacaoSelected.value.HDDID,
          'mac': associacaoSelected.value.mac,
          'obs': associacaoSelected.value.obs,
          'Valor': associacaoSelected.value.Valor,
          'Versao': associacaoSelected.value.Versao
        }
    ).then(() => {
      alert('Dados atualizados!')
    });
  }
}

function deleteDocumento(documentoID: string): void {
  const promise = databases.deleteDocument(DataBaseID, tabelaID, documentoID);

  promise.then(function () {
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

    if (entidade.HDDID && entidade.CNPJ && entidade.DataLicenca) {
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
            mac: entidade.mac,
            obs: entidade.obs
          }).then(() => {
        showMensagem(
            'Cadastro efetuado com sucesso!',
            'success',
            'Dados salvos')

        entidade = {}
      }).catch((error) => {
        showMensagem(
            'Erro ao efetuar o cadastro!',
            'error',
            `Dados não foram salvos: ${error}`)
      })

      await loadUpdate()
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

function has180DaysPassed(dateString: string): boolean {
  // Converter a string para o formato de data, usando o padrão 'dd/mm/yyyy'
  const [day, month, year] = dateString.split('/').map(Number);
  const inputDate = new Date(year, month - 1, day); // O mês é baseado em zero

  // Obter a data atual
  const today = new Date();

  // Calcular a diferença em milissegundos
  const diffInMs = today.getTime() - inputDate.getTime();

  // Converter a diferença para dias (1 dia = 24 horas * 60 minutos * 60 segundos * 1000 milissegundos)
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // Verificar se a diferença é maior ou igual a 180 dias
  return diffInDays > 180;
}

</script>

<template>
  <Toast/>
  <div class="h-3rem bg-blue-400 flex align-items-center justify-content-between p-2 text-white">
    <div class="flex align-items-center gap-2">
      <img src="/cherry.png" alt="cherry" width="24" height="24"/>
      <span class="font-semibold uppercase"> Gerenciador SindPesca</span>
    </div>

    <span class="cursor-pointer" @click="route.push({path:'/', replace:true})">Sair</span>
  </div>
  <div class="flex p-2 flex-column">


    <Dialog v-model:visible="visibleDialogDetalhes" modal header="Detalhes da Entidade"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :style="{ width: '50vw' }">

      <form id="detalheForm" method="post">
        <div class="gap-2 flex flex-wrap">
          <div class="flex w-full">
            <InputText class="w-full" v-model="associacaoSelected.Associacao" placeholder="Nome Entidade"/>
          </div>
          <div class="flex w-full">
            <InputText class="w-full" disabled v-model="associacaoSelected.CNPJ" placeholder="CNPJ"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" disabled v-model="associacaoSelected.Presidente" placeholder="Presidente"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" disabled v-model="associacaoSelected.CPF" placeholder="CPF"/>
          </div>

          <div class="flex gap-2 w-full">
            <InputNumber input-class="w-full" class="w-12 md:w-6" type="number" v-model="associacaoSelected.Valor"
                         placeholder="Valor"/>
            <InputNumber input-class="w-full" class="w-12 md:w-6" :min="0" :max="100" :minFractionDigits="2"
                         v-model="associacaoSelected.Versao"
                         placeholder="Versão"/>
          </div>

          <div class="flex gap-2 w-full">
            <InputText class="w-full" v-model="associacaoSelected.HDDID" placeholder="HDDID"/>
            <InputText class="w-full" v-model="associacaoSelected.mac" placeholder="MAC"/>
          </div>

          <div class="flex gap-2 w-full">
            <InputMask class="w-full w-6" mask="99/99/9999" v-model="associacaoSelected.DataLicenca" placeholder="Data da Licença"/>
            <InputText class="w-full w-6" placeholder="Observação" v-model="associacaoSelected.obs"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" disabled placeholder="Cidade" v-model="associacaoSelected.cidade"/>
          </div>
        </div>

        <Button @click="uptateDocumento" icon="pi pi-refresh"
                class="mt-2 w-full p-button-warning text-800"
                label="Atualizar dados"/>

        <span class="text-xs text-400"> ID {{ associacaoSelected.$id }}</span>
      </form>

    </Dialog>

    <div class="flex gap-2 mb-2 w-full align-items-center justify-content-between">

      <Button label="Adicionar Entidade"
              @click="visibleDialogCadastro = true"
              icon="pi pi-plus" size="small"
              class="my-2 w-full md:w-3"/>

      <span class="font-medium text-700 text-xs uppercase">
       Entidades Cadastradas: {{ documentos?.length || 0 }}
      </span>
    </div>

    <DataTable v-model:filters="filters" tableStyle="min-width: 50rem"
               :value="documentos" paginator selection-mode="single" v-model:selection="associacaoSelected"
               :rows="(height <= 768) ? 8 : 10" size="small"
               :globalFilterFields="['CNPJ', 'CPF', 'Presidente', 'mac', 'cidade', 'HDDID']">

      <template #header>
        <div class="flex justify-content-end">
            <span class="p-input-icon-left flex align-items-center gap-1 w-full md:w-3">
                <InputText class="w-full" size="small" v-model="filters['global'].value" placeholder="Procurar.."/>
               <i class="pi pi-search"/>
            </span>
        </div>
      </template>
      <Column field="CNPJ" filterField="CNPJ" class="text-sm" header="CNPJ"></Column>
      <Column field="CPF" header="CPF" class="text-sm"></Column>
      <Column class="text-sm" header="Status">
        <template #body="slotProps">
          <div class="w-3rem flex align-items-center  justify-content-center bg-red-300 border-round-2xl ">
            <span class="text-xs p-1 text-white-alpha-90"
                  v-if="has180DaysPassed(slotProps.data.DataLicenca)">Inativo </span>
          </div>
          <div class="w-3rem flex align-items-center  justify-content-center bg-green-300  border-round-2xl ">
            <span class=" border-round-2xl text-xs p-1 text-white-alpha-90"
                  v-if="!has180DaysPassed(slotProps.data.DataLicenca)">Ativo</span>
          </div>
        </template>
      </Column>
      <Column field="Presidente" class="text-sm" header="Presidente"></Column>
      <Column field="cidade" class="text-sm" header="Cidade"></Column>
      <Column field="mac" class="text-sm" header="MAC"></Column>
      <Column field="HDDID" class="text-sm" header="HDID"></Column>
      <Column field="DataLicenca" class="text-sm" header="Data"></Column>
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
            <InputNumber input-class="w-full" :min="0" :max="100" :minFractionDigits="2" v-model="entidade.Versao"
                         placeholder="Versão"/>
          </div>

          <div class="flex gap-2 w-full">
            <InputText class="w-full" v-model="entidade.HDDID" placeholder="HDDID"/>
            <InputText class="w-full" v-model="entidade.mac" placeholder="MAC"/>
          </div>

          <div class="flex gap-2 w-full">
            <Calendar class="w-full w-6" dateFormat="dd/mm/yy" showIcon fluid v-model="entidade.DataLicenca"
                      placeholder="Data Licença"/>
            <InputText class="w-full w-6" placeholder="observação" v-model="entidade.obs"/>
          </div>

          <div class="flex w-full">
            <InputText class="w-full" placeholder="Cidade" v-model="entidade.cidade"/>
          </div>
        </div>

        <Button @click="createDocumento" icon="pi pi-save"
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
