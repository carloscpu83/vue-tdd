<template>
    <div class="card">
        <div class="card-header text-center">
        <slot name="header"></slot>
      </div>
      <div class="card-body">
        <slot name=body></slot>
      </div>
      <div class="card-footer">
        <slot name=footer></slot>
      </div>
    </div>
</template>