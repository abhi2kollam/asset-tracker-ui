<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Row Expand</h5>
        <DataTable
          :value="products"
          v-model:expandedRows="expandedRows"
          dataKey="id"
          responsiveLayout="scroll"
          v-model:filters="filters1"
          filterDisplay="menu"
          :loading="loading1"
          :filters="filters1"
          :globalFilterFields="[
            'name',
            'country.name',
            'representative.name',
            'balance',
            'status',
          ]"
        >
          <template #header>
            <div>
              <Button
                icon="pi pi-plus"
                label="Expand All"
                @click="expandAll"
                class="mr-2 mb-2"
              />
              <Button
                icon="pi pi-minus"
                label="Collapse All"
                @click="collapseAll"
                class="mb-2"
              />
               <span class="p-input-icon-left mb-2">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters1['global'].value"
                  placeholder="Keyword Search"
                  style="width: 100%"
                />
              </span>
            </div>
          </template>
          <Column :expander="true" headerStyle="width: 3rem" />
          <Column field="name" header="Name" :sortable="true">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column header="Image">
            <template #body="slotProps">
              <img
                :src="'images/product/' + slotProps.data.image"
                :alt="slotProps.data.image"
                class="shadow-2"
                width="100"
              />
            </template>
          </Column>
          <Column field="price" header="Price" :sortable="true">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.price) }}
            </template>
          </Column>
          <Column field="category" header="Category" :sortable="true">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.category) }}
            </template></Column
          >
          <Column field="rating" header="Reviews" :sortable="true">
            <template #body="slotProps">
              <Rating
                :modelValue="slotProps.data.rating"
                :readonly="true"
                :cancel="false"
              />
            </template>
          </Column>
          <Column field="inventoryStatus" header="Status" :sortable="true">
            <template #body="slotProps">
              <span
                :class="
                  'product-badge status-' +
                  (slotProps.data.inventoryStatus
                    ? slotProps.data.inventoryStatus.toLowerCase()
                    : '')
                "
                >{{ slotProps.data.inventoryStatus }}</span
              >
            </template>
          </Column>
          <template #expansion="slotProps">
            <div class="p-3">
              <h5>Orders for {{ slotProps.data.name }}</h5>
              <DataTable
                :value="slotProps.data.orders"
                responsiveLayout="scroll"
              >
                <Column field="id" header="Id" :sortable="true">
                  <template #body="slotProps">
                    {{ slotProps.data.id }}
                  </template>
                </Column>
                <Column field="customer" header="Customer" :sortable="true">
                  <template #body="slotProps">
                    {{ slotProps.data.customer }}
                  </template>
                </Column>
                <Column field="date" header="Date" :sortable="true">
                  <template #body="slotProps">
                    {{ slotProps.data.date }}
                  </template>
                </Column>
                <Column field="amount" header="Amount" :sortable="true">
                  <template #body="slotProps" :sortable="true">
                    {{ formatCurrency(slotProps.data.amount) }}
                  </template>
                </Column>
                <Column field="status" header="Status" :sortable="true">
                  <template #body="slotProps">
                    <span
                      :class="
                        'order-badge order-' +
                        (slotProps.data.status
                          ? slotProps.data.status.toLowerCase()
                          : '')
                      "
                      >{{ slotProps.data.status }}</span
                    >
                  </template>
                </Column>
                <Column headerStyle="width:4rem">
                  <template #body>
                    <Button icon="pi pi-search" />
                  </template>
                </Column>
              </DataTable>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

  </div>
</template>

<script>
import { FilterMatchMode, FilterOperator } from "primevue/api";
import CustomerService from "../service/CustomerService";
import ProductService from "../service/ProductService";
export default {
  data() {
    return {
      customer1: null,
      customer2: null,
      customer3: null,
      filters1: null,
      filters2: {},
      loading1: true,
      loading2: true,
      idFrozen: false,
      products: null,
      expandedRows: [],
      statuses: [
        "unqualified",
        "qualified",
        "new",
        "negotiation",
        "renewal",
        "proposal",
      ],
      representatives: [
        { name: "Amy Elsner", image: "amyelsner.png" },
        { name: "Anna Fali", image: "annafali.png" },
        { name: "Asiya Javayant", image: "asiyajavayant.png" },
        { name: "Bernardo Dominic", image: "bernardodominic.png" },
        { name: "Elwin Sharvill", image: "elwinsharvill.png" },
        { name: "Ioni Bowcher", image: "ionibowcher.png" },
        { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
        { name: "Onyama Limba", image: "onyamalimba.png" },
        { name: "Stephen Shaw", image: "stephenshaw.png" },
        { name: "XuXue Feng", image: "xuxuefeng.png" },
      ],
    };
  },
  customerService: null,
  productService: null,
  created() {
    this.customerService = new CustomerService();
    this.productService = new ProductService();
    this.initFilters1();
  },
  mounted() {
    this.productService
      .getProductsWithOrdersSmall()
      .then((data) => (this.products = data));
    this.customerService.getCustomersLarge().then((data) => {
      this.customer1 = data;
      this.loading1 = false;
      this.customer1.forEach(
        (customer) => (customer.date = new Date(customer.date))
      );
    });
    this.customerService
      .getCustomersLarge()
      .then((data) => (this.customer2 = data));
    this.customerService
      .getCustomersMedium()
      .then((data) => (this.customer3 = data));
    this.loading2 = false;
  },
  methods: {
    initFilters1() {
      this.filters1 = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        "country.name": {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        balance: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        status: {
          operator: FilterOperator.OR,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS },
      };
    },
    clearFilter1() {
      this.initFilters1();
    },
    expandAll() {
      this.expandedRows = this.products.filter((p) => p.id);
    },
    collapseAll() {
      this.expandedRows = null;
    },
    formatCurrency(value) {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
    formatDate(value) {
      return value.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    calculateCustomerTotal(name) {
      let total = 0;
      if (this.customer3) {
        for (let customer of this.customer3) {
          if (customer.representative.name === name) {
            total++;
          }
        }
      }

      return total;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";

::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
