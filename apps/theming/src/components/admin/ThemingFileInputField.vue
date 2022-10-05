<!--
  - @copyright 2022 Christopher Ng <chrng8@gmail.com>
  -
  - @author Christopher Ng <chrng8@gmail.com>
  -
  - @license AGPL-3.0-or-later
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
-->

<template>
	<div class="field">
		<label :for="id">{{ displayName }}</label>
		<div class="field__row">
			<NcButton :id="id"
				type="secondary"
				:aria-label="ariaLabel"
				@click="activateLocalFilePicker">
				<template #icon>
					<Upload :size="20" />
				</template>
				{{ t('theming', 'Upload') }}
			</NcButton>

			<NcButton v-if="mimeValue !== defaultMimeValue"
				type="tertiary"
				:aria-label="t('theming', 'Reset to default')"
				@click="undo">
				<template #icon>
					<Undo :size="20" />
				</template>
			</NcButton>

			<NcButton v-else-if="name === 'background'"
				type="tertiary"
				@click="removeBackground">
				<template #icon>
					<Delete :title="t('theming', 'Remove background image')" :size="20" />
				</template>
			</NcButton>
		</div>

		<div v-if="(name === 'logoheader' || name === 'favicon') && mimeValue !== defaultMimeValue"
			class="field__preview"
			:class="{
				'field__preview--logoheader': name === 'logoheader',
				'field__preview--favicon': name === 'favicon',
			}" />

		<NcNoteCard v-if="showSuccess"
			type="success">
			<p>{{ t('theming', 'Saved') }}</p>
		</NcNoteCard>
		<NcNoteCard v-if="errorMessage"
			type="error"
			:show-alert="true">
			<p>{{ errorMessage }}</p>
		</NcNoteCard>

		<input ref="input"
			type="file"
			@change="onChange">
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

import { NcButton, NcNoteCard } from '@nextcloud/vue'

import Delete from 'vue-material-design-icons/Delete.vue'
import Undo from 'vue-material-design-icons/UndoVariant.vue'
import Upload from 'vue-material-design-icons/Upload.vue'

import ThemingMixin from '../../mixins/admin/ThemingMixin.js'

export default {
	name: 'ThemingFileInputField',

	components: {
		Delete,
		NcButton,
		NcNoteCard,
		Undo,
		Upload,
	},

	mixins: [
		ThemingMixin,
	],

	props: {
		name: {
			type: String,
			required: true,
		},
		mimeName: {
			type: String,
			required: true,
		},
		mimeValue: {
			type: String,
			required: true,
		},
		defaultMimeValue: {
			type: String,
			required: true,
		},
		displayName: {
			type: String,
			required: true,
		},
		ariaLabel: {
			type: String,
			required: true,
		},
	},

	methods: {
		activateLocalFilePicker() {
			// Set to null so that selecting the same file will trigger the change event
			this.$refs.input.value = null
			this.$refs.input.click()
		},

		async onChange(e) {
			const file = e.target.files[0]

			const formData = new FormData()
			formData.append('key', this.name)
			formData.append('image', file)

			const url = generateUrl('/apps/theming/ajax/uploadImage')
			try {
				const { data } = await axios.post(url, formData)
				// FIXME use actual mimetype
				this.$emit('update:mime-value', data.data.name)
				this.showSuccess = true
				setTimeout(() => { this.showSuccess = false }, 2000)
				this.$emit('update:theming')
			} catch (e) {
				this.errorMessage = e.response.data.data.message
			}
		},

		async removeBackground() {
			const url = generateUrl('/apps/theming/ajax/updateStylesheet')
			try {
				await axios.post(url, { setting: this.mimeName, value: 'backgroundColor' })
				this.$emit('update:mime-value', 'backgroundColor')
				this.showSuccess = true
				setTimeout(() => { this.showSuccess = false }, 2000)
				this.$emit('update:theming')
			} catch (e) {
				this.errorMessage = e.response.data.data.message
			}
		},

		async undo() {
			this.reset()
			const url = generateUrl('/apps/theming/ajax/undoChanges')

			try {
				const { data } = await axios.post(url, { setting: this.mimeName })
				this.$emit('update:mime-value', data.data.value)
				this.showSuccess = true
				setTimeout(() => { this.showSuccess = false }, 2000)
				this.$emit('update:theming')
			} catch (e) {
				this.errorMessage = e.response.data.data.message
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.field {
	display: flex;
	flex-direction: column;
	gap: 10px 0;

	&__row {
		display: flex;
		gap: 0 6px;

		label {
			width: 180px;
			white-space: nowrap;
		}
	}

	&__preview {
		width: 80px;
		height: 80px;
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
		margin: 10px 0;

		&--logoheader {
			background-image: var(--image-logoheader);
		}
		&--favicon {
			background-image: var(--image-favicon);
		}
	}
}

input[type="file"] {
	display: none;
}
</style>
