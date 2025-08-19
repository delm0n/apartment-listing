<template>
  <aside class="filters">
    <!-- Количество комнат -->
    <div class="filters-button">
      <button
        v-for="n in 4"
        :key="n"
        @click="setRooms(n)"
        :class="['filters-button__item', { active: activeRooms === n }]"
      >
        {{ n }}к
      </button>
    </div>

    <!-- Стоимость квартиры -->
    <div class="filters-group">
      <label>Стоимость квартиры, ₽</label>

      <div class="filters-group__value">
        <p>
          от
          <span>
            {{ formatPrice(priceRange[0]) }}
          </span>
        </p>

        <p>
          до
          <span>
            {{ formatPrice(priceRange[1]) }}
          </span>
        </p>
      </div>

      <USlider
        class="filters-group__slider h-4"
        v-model="priceRange"
        :min="priceRangeLimits[0]"
        :max="priceRangeLimits[1]"
        :step="100000"
        @update:modelValue="onPriceChange"
        :disabled="isLoading"
        size="xs"
      />
    </div>

    <!-- Площадь квартиры -->
    <div class="filters-group">
      <label>Площадь, м²</label>

      <div class="filters-group__value">
        <p>
          от <span>{{ areaRange[0] }}</span>
        </p>
        <p>
          до <span>{{ areaRange[1] }}</span>
        </p>
      </div>

      <USlider
        class="filters-group__slider h-4"
        v-model="areaRange"
        :min="areaRangeLimits[0]"
        :max="areaRangeLimits[1]"
        :step="1"
        @update:modelValue="onAreaChange"
        :disabled="isLoading"
        size="xs"
      />
    </div>

    <!-- Кнопка сброса -->
    <button
      @click="store.resetFilters"
      class="filters-reset"
      aria-label="Сбросить параметры"
    >
      Сбросить параметры
      <span class="filters-reset__icon"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.99996 5.22223L1.37727 7.84492C1.12213 8.10007 0.641687 8.0333 0.304183 7.6958C-0.0333213 7.35829 -0.100086 6.87786 0.15506 6.62271L2.77775 4.00002L0.155017 1.37729C-0.100129 1.12214 -0.0333644 0.641701 0.30414 0.304197C0.641644 -0.0333071 1.12208 -0.100072 1.37723 0.155074L3.99996 2.77781L6.62282 0.154956C6.87796 -0.10019 7.3584 -0.0334256 7.6959 0.304079C8.03341 0.641583 8.10017 1.12202 7.84503 1.37717L5.22217 4.00002L7.84498 6.62283C8.10013 6.87797 8.03336 7.35841 7.69586 7.69592C7.35836 8.03342 6.87792 8.10019 6.62277 7.84504L3.99996 5.22223Z"
            fill="#FF0000"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.99996 5.22223L1.37727 7.84492C1.12213 8.10007 0.641687 8.0333 0.304183 7.6958C-0.0333213 7.35829 -0.100086 6.87786 0.15506 6.62271L2.77775 4.00002L0.155017 1.37729C-0.100129 1.12214 -0.0333644 0.641701 0.30414 0.304197C0.641644 -0.0333071 1.12208 -0.100072 1.37723 0.155074L3.99996 2.77781L6.62282 0.154956C6.87796 -0.10019 7.3584 -0.0334256 7.6959 0.304079C8.03341 0.641583 8.10017 1.12202 7.84503 1.37717L5.22217 4.00002L7.84498 6.62283C8.10013 6.87797 8.03336 7.35841 7.69586 7.69592C7.35836 8.03342 6.87792 8.10019 6.62277 7.84504L3.99996 5.22223Z"
            fill="#0B1739"
          />
        </svg>
      </span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useApartmentsStore } from "~/store/apartments";
import { formatPrice } from "~/utils/formatPrice";

const store = useApartmentsStore();
const isLoading = computed(() => store.isLoading);
const activeRooms = computed(() => store.filters.rooms);

// --- Диапазон цены ---
const priceRangeLimits = computed(() => store.priceRangeLimits);
const priceRange = computed({
  get: () => store.filters.priceRange,
  set: (value) => {
    store.debouncedPrice = value;
  },
});
const onPriceChange = () => {
  if (store.debouncedPrice) {
    store.updateFiltersDebounced({ priceRange: store.debouncedPrice });
    store.debouncedPrice = null;
  }
};

// --- Диапазон площади ---
const areaRangeLimits = computed(() => store.areaRangeLimits);
const areaRange = computed({
  get: () => store.filters.areaRange,
  set: (value) => {
    store.debouncedArea = value;
  },
});
const onAreaChange = () => {
  if (store.debouncedArea) {
    store.updateFiltersDebounced({ areaRange: store.debouncedArea });
    store.debouncedArea = null;
  }
};

// --- Количество комнат ---
const setRooms = (n: number) => {
  const newRooms = activeRooms.value === n ? null : n;
  store.setRooms(newRooms);
};
</script>

<style lang="scss" scoped>
.filters {
  padding: 40px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(174, 228, 178, 0.3) 0%,
    rgba(149, 208, 161, 0.3) 100%
  );

  @media (max-width: 960px) {
    padding: 20px;
  }

  &-group {
    margin-top: 24px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #333;

      @media (max-width: 960px) {
        font-size: 13px;
        line-height: 18px;
      }
    }

    &__value {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;

      display: flex;
      align-items: center;
      margin-bottom: 12px;

      @media (max-width: 960px) {
        font-size: 14px;
        line-height: 20px;
      }

      p {
        width: 50%;
        display: flex;
        align-items: end;
        gap: 8px;

        span {
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;

          @media (max-width: 960px) {
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }

    &__slider {
      --ui-bg: rgba(62, 181, 124, 1);
      --ui-primary: rgba(62, 181, 124, 1);
      cursor: pointer;
      --ui-bg-accented: rgba(205, 222, 212, 1);
    }
  }

  &-slider__value {
    font-size: 14px;
    color: #555;
    text-align: center;
    margin-top: 8px;
  }

  &-button {
    display: flex;
    gap: 16px;
    flex-wrap: nowrap;

    &__item {
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 100px;
      background: rgba(255, 255, 255, 1);
      width: 44px;
      height: 44px;
      font-weight: 400;
      font-size: 16px;
      border: none;
      outline: none;

      @media (hover: hover) {
        &:hover:not(:disabled) {
          background: $color-primary;
          opacity: 0.7;
          color: white;
        }
      }

      &:active:not(:disabled) {
        transform: translateY(1px);
      }

      &.active {
        color: white;
        background: $color-primary;
        box-shadow: 0px 6px 20px 0px rgba(149, 208, 161, 0.5);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }

  &-reset {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    margin-top: 29px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: rgba(0, 0, 0, 1);

    transition: all 0.2s ease;
    * {
      transition: all 0.2s ease;
    }

    @media (max-width: 960px) {
      font-size: 13px;
      line-height: 18px;
    }

    @media (hover: hover) {
      &:hover {
        color: $color-primary;

        svg path {
          fill: $color-primary;
        }
      }
    }

    &:active {
      transform: translateY(1px);
    }

    &__icon {
      font-size: 16px;
      line-height: 1;
    }
  }
}
</style>
