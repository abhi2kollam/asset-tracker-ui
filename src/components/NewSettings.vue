/* eslint-disable vue/valid-v-for */
<template>
  <div class="card col-10">
    <div class="p-fluid">
      <h5>New Settings</h5>
      <div class="field grid">
        <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0"
          >Settings Name</label
        >
        <div class="col-12 md:col-10">
          <InputText id="name3" type="text" v-model="setting.name" />
        </div>
      </div>
      <div class="field grid">
        <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">Icon</label>
        <div class="col-12 md:col-10">
          <Dropdown
            v-model="setting.icon"
            :options="fontAwesomeIcons"
            optionLabel="name"
            placeholder="Select icon"
            :filter="true"
            :virtual-scroller-options="{ itemSize: 40 }"
          >
            <template #value="slotProps">
              <div
                v-if="slotProps.value"
                class="
                  inline-flex
                  align-items-center
                  py-1
                  px-2
                  bg-primary
                  text-primary
                  border-round
                  mr-2
                "
              >
                <span
                  :class="'mr-2 ' + slotProps.value.code"
                  style="width: 18px; height: 12px"
                />
                <div>{{ slotProps.value.name }}</div>
              </div>
              <template v-if="!slotProps.value || slotProps.value.length === 0">
                <div class="p-1">Select icon</div>
              </template>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <span
                  :class="'mr-2 ' + slotProps.option.code"
                  style="width: 18px; height: 12px"
                />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
      <Fieldset
        :legend="`Property ${index + 1}`"
        v-for="(prop, index) in setting.props"
        :key="index"
        class="mb-2 relative"
      >
        <Button
          icon="pi pi-times "
          @click="deleteProp(index)"
          class="p-button-rounded p-button-warning mr-2 mb-2 close-icon"
        />
        <div class="field grid">
          <label for="email3" class="col-12 mb-2 md:col-2 md:mb-0"
            >Property Name</label
          >
          <div class="col-12 md:col-10">
            <InputText  type="text" v-model.lazy="prop.name" />
          </div>
        </div>
        <div class="field grid">
          <label  class="col-12 mb-2 md:col-2 md:mb-0"></label>
          <div class="col-12 md:col-10 field-checkbox">
            <Checkbox
              :id="`checkOption-${index}`"
              :binary="true"
              name="option"
              v-model="prop.isUnique"
            />
            <label :for="`checkOption-${index}`">Unique property</label>
          </div>
        </div>
        <div class="field grid">
          <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">Type</label>
          <div class="col-12 md:col-10">
            <Dropdown
              id="state"
              v-model="prop.type"
              :options="dropdownItems"
              optionValue="code"
              optionLabel="name"
              placeholder="Select Type"
            ></Dropdown>
          </div>
        </div>
        <div class="field grid" v-if="prop.type === 'Complex'">
          <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0"
            >Complex Type</label
          >
          <div class="col-12 md:col-10">
            <Dropdown
              id="state"
              v-model="prop.complexType"
              :options="dropdownItems1"
              optionLabel="name"
              optionValue="code"
              placeholder="Select One"
            ></Dropdown>
          </div>
        </div>
      </Fieldset>
    </div>
    <div class="grid justify-content-end mt-3">
      <Button
        label="Add New Property"
        icon="pi pi-plus-circle"
        @click="addMoreProps()"
      />
    </div>
  </div>
  <div class="grid col-10 justify-content-end mt-3">
    <Button
      label="Save"
      :disabled="setting.props.length === 0"
      icon="pi pi-check"
      class="p-button-success"
      @click="saveSettings()"
    />
  </div>
</template>

<script>
import { map } from "lodash";
import SettingsService from "../service/SettingsService";
export default {
  data() {
    return {
      defaultProps: {
        name: "",
        isUnique: false,
        type: "String",
        complexType: null,
      },
      setting: {
        name: "",
        icon: null,
        props: [],
      },
      dropdownItems: [
        { name: "String", code: "String" },
        { name: "Number", code: "Number" },
        { name: "Complex", code: "Complex" },
      ],
      dropdownItems1: [],
      fontAwesomeIcons: [],
    };
  },
  created() {
    this.settingsService = new SettingsService();
  },
  beforeMount() {
    this.setting.props = [{ ...this.defaultProps }];
  },
  async mounted() {
    this.fontAwesomeIcons = await this.settingsService.getFontIcons();
    const savedSettings = await this.settingsService.getSettingsList();
    this.dropdownItems1 = map(savedSettings, (setting) => {
      return {
        name: setting.name,
        code: setting.name,
      };
    });
  },
  methods: {
    addMoreProps() {
      this.setting.props.push({ ...this.defaultProps });
    },
    saveSettings() {
      this.settingsService.saveSettings(this.setting);
    },
    deleteProp(index) {
      this.setting.props.splice(index, 1);
    },
  },
};
</script>
<style scoped>
.close-icon {
  position: absolute;
  top: -3rem;
  right: -1rem;
}
</style>