import type { GeneratorMenuAndRoutesOptions } from '@vben/access';
import type { ComponentRecordType } from '@vben/types';

import { generateMenusAndRoutes } from '@vben/access';
import { $t } from '@vben/locales';
import { preferences } from '@vben-core/preferences';

import { message } from 'ant-design-vue';

import { getAllMenus } from '#/apis';
import { BasicLayout, IFrameView } from '#/layouts';

const forbiddenPage = () => import('#/views/_essential/fallback/forbidden.vue');

async function generateAccess(options: GeneratorMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateMenusAndRoutes(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loading-menu')}...`,
        duration: 1.5,
      });
      return await getAllMenus();
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent: forbiddenPage,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
