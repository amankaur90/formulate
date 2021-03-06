﻿namespace formulate.app.Helpers
{

    // Namespaces.
    using Umbraco.Core;
    using Umbraco.Core.Services;


    /// <summary>
    /// Assists with localization tasks (e.g., translating terms).
    /// </summary>
    internal class LocalizationHelper
    {

        #region

        /// <summary>
        /// Gets the name of the specified tree in the current language.
        /// </summary>
        /// <param name="tree">
        /// The name of the tree.
        /// </param>
        /// <returns>
        /// The name of the tree in the current language.
        /// </returns>
        public static string GetTreeName(string tree)
        {
            var key = string.Format("formulate-trees/{0}", tree);
            return ApplicationContext.Current.Services.TextService.Localize(key);
        }


        /// <summary>
        /// Gets the name of the specified data value in the current language.
        /// </summary>
        /// <param name="name">
        /// The name of the data value.
        /// </param>
        /// <returns>
        /// The name of the data value in the current language.
        /// </returns>
        public static string GetDataValueName(string name)
        {
            var key = string.Format("formulate-data-value-names/{0}", name);
            return ApplicationContext.Current.Services.TextService.Localize(key);
        }


        /// <summary>
        /// Gets the name of the specified layout in the current language.
        /// </summary>
        /// <param name="name">
        /// The name of the layout.
        /// </param>
        /// <returns>
        /// The name of the layout in the current language.
        /// </returns>
        public static string GetLayoutName(string name)
        {
            var key = string.Format("formulate-layout-names/{0}", name);
            return ApplicationContext.Current.Services.TextService.Localize(key);
        }


        /// <summary>
        /// Gets the name of the specified menu item in the current language.
        /// </summary>
        /// <param name="name">
        /// The name of the menu item.
        /// </param>
        /// <returns>
        /// The name of the menu item in the current language.
        /// </returns>
        public static string GetMenuItemName(string name)
        {
            var key = string.Format("formulate-menu-item-names/{0}", name);
            return ApplicationContext.Current.Services.TextService.Localize(key);
        }

        #endregion

    }

}