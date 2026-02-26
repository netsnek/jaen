// src/vars/i18nJaen.tsx
export type I18nCode = 'en-US' | 'de-AT' | 'tr-TR' | 'ar-EG'

/** Jaen CMS i18n — flat key/value messages (no runtime flattening) */
export function getI18nJaen(code: I18nCode) {
  if (code === 'de-AT') {
    return {
      code,
      strings: {
        Language: 'Deutsch (Österreich)',

        AuthLogin: 'Anmelden',
        AuthSignup: 'Registrieren',
        AuthLogout: 'Abmelden',
        AuthSettings: 'Einstellungen',

        CmsLabelsRoot: 'CMS',

        CmsDashboardTitle: 'Jaen CMS',
        CmsDashboardMenuLabel: 'Dashboard',
        CmsDashboardMenuGroupLabel: 'Jaen CMS',

        CmsPagesTitle: 'Jaen CMS | Seiten',
        CmsPagesMenuLabel: 'Seiten',

        CmsPagesBreadcrumbsPages: 'Seiten',
        CmsPagesBreadcrumbsNew: 'Neu',

        CmsPagesNotificationsCreated: 'Seite erstellt',
        CmsPagesNotificationsCreatedDescription: 'Seite {title} wurde erstellt',
        CmsPagesNotificationsUpdated: 'Seite aktualisiert',
        CmsPagesNotificationsUpdatedDescription:
          'Seite {title} wurde aktualisiert',
        CmsPagesNotificationsDeleted: 'Seite gelöscht',
        CmsPagesNotificationsDeletedDescription: 'Seite {slug} wurde gelöscht',
        CmsPagesNotificationsDuplicated: 'Seite dupliziert',
        CmsPagesNotificationsDuplicatedDescription:
          'Seite {slug} wurde dupliziert',
        CmsPagesNotificationsMoved: 'Seite verschoben',
        CmsPagesNotificationsMovedDescription: 'Seite {slug} wurde verschoben',
        CmsPagesNotificationsSlugUpdated: 'Slug aktualisiert',
        CmsPagesNotificationsSlugUpdatedDescription:
          'Slug wurde auf {slug} geändert',
        CmsPagesNotificationsDuplicateFailed:
          'Seite konnte nicht dupliziert werden',
        CmsPagesNotificationsMoveFailed: 'Seite konnte nicht verschoben werden',
        CmsPagesNotificationsSlugUpdateFailed:
          'Slug konnte nicht aktualisiert werden',

        CmsPagesActionsDuplicate: 'Seite duplizieren',
        CmsPagesActionsMove: 'Seite verschieben',
        CmsPagesActionsUpdateSlug: 'Slug aktualisieren',
        CmsPagesActionsRenameSlug: 'Slug umbenennen',
        CmsPagesActionsDelete: 'Seite löschen',
        CmsPagesActionsDeleteThis: 'Diese Seite löschen',

        CmsPagesDescriptionsDuplicate:
          'Dies dupliziert die Seite samt ihrer Unterseiten.',
        CmsPagesDescriptionsMove:
          'Dies verschiebt die Seite und alle ihre Unterseiten.',
        CmsPagesDescriptionsUpdateSlug:
          'Dies benennt den Slug um und beeinflusst damit den Pfad der Seite und aller Unterseiten.',
        CmsPagesDescriptionsDelete:
          'Dies löscht die Seite und alle ihre Unterseiten.',

        CmsPagesPromptsDuplicateTitle: 'Seite duplizieren',
        CmsPagesPromptsDuplicateMessage:
          'Bitte gib einen neuen Slug für die duplizierte Seite ein. Dies beeinflusst den Pfad.',
        CmsPagesPromptsDuplicateConfirm: 'Duplizieren',
        CmsPagesPromptsDuplicateCancel: 'Abbrechen',
        CmsPagesPromptsDuplicatePlaceholder: '{slug}-kopie',

        CmsPagesPromptsMoveTitle: 'Seite verschieben',
        CmsPagesPromptsMoveMessage: 'Bitte wähle eine neue Elternseite.',
        CmsPagesPromptsMoveConfirm: 'Verschieben',
        CmsPagesPromptsMoveCancel: 'Abbrechen',

        CmsPagesPromptsRenameSlugTitle: 'Slug umbenennen',
        CmsPagesPromptsRenameSlugMessage:
          'Bitte gib einen neuen Slug ein. Dies beeinflusst den Pfad.',
        CmsPagesPromptsRenameSlugConfirm: 'Umbenennen',
        CmsPagesPromptsRenameSlugCancel: 'Abbrechen',

        CmsPagesPromptsDeleteTitle: 'Seite löschen',
        CmsPagesPromptsDeleteMessage:
          'Bist du sicher, dass du diese Seite und alle ihre Unterseiten löschen möchtest?',
        CmsPagesPromptsDeleteConfirm: 'Löschen',

        CmsPagesTableSubpagesHeading: 'Unterseiten',
        CmsPagesTableReorderEnable: 'Neu anordnen',
        CmsPagesTableReorderDisable: 'Fertig',
        CmsPagesTableNewPage: 'Neue Seite',
        CmsPagesTableColumnsTitle: 'Titel',
        CmsPagesTableColumnsDescription: 'Beschreibung',
        CmsPagesTableColumnsDate: 'Datum',
        CmsPagesTableEmptyStateDescription:
          'Diese Seite hat noch keine Unterseiten.',
        CmsPagesTableEmptyStateAction: 'Neue Seite erstellen',
        CmsPagesTableDateCreated: 'Erstellt am {date} um {time}',
        CmsPagesTableDateUpdated: 'Zuletzt geändert am {date} um {time}',
        CmsPagesTableDateEmpty: '-',
        CmsPagesTableReorderError:
          'Beim Neuordnen der Seiten ist ein Fehler aufgetreten.',
        CmsPagesTableDangerZoneHeading: 'Gefahrenbereich',

        CmsPagesLabelsNoTitle: 'Kein Titel',
        CmsPagesLabelsNoDescription: 'Keine Beschreibung',
        CmsPagesLabelsFallbackTitle: 'Seite',
        CmsPagesLabelsYes: 'Ja',

        CmsPagesFormHeadingCreate: 'Neue Seite erstellen',
        CmsPagesFormHeadingEdit: 'Seite bearbeiten',
        CmsPagesFormLeadCreate:
          'Eine Seite ist eine Anordnung von Feldern oder Blöcken, die unter einer bestimmten URL angezeigt werden.',
        CmsPagesFormLeadEdit:
          'Bearbeite die Seite. Verbessere SEO und Auftritt in sozialen Medien.',
        CmsPagesFormTemplateCreate: 'Wähle ein Template für die neue Seite',
        CmsPagesFormTemplateEdit: 'Das Template der Seite',
        CmsPagesFormTemplateHelperTextCreate:
          'Dieses Template wird basierend auf der Elternseite auf die neue Seite angewendet.',
        CmsPagesFormTemplateHelperTextEdit:
          'Wenn du das Template ändern möchtest, erstelle eine neue Seite und übertrage die Inhalte.',
        CmsPagesFormTitleCreate: 'Gib einen Titel für die neue Seite ein',
        CmsPagesFormTitleEdit: 'Der Titel der Seite',
        CmsPagesFormTitleHelperTextCreate:
          'Der Titel der neuen Seite. Der URL-Slug wird automatisch aus dem Titel generiert.',
        CmsPagesFormTitleHelperTextEdit: 'Der Titel der Seite.',
        CmsPagesFormDescriptionCreate: 'Beschreibe die neue Seite',
        CmsPagesFormDescriptionEdit: 'Die Beschreibung der Seite',
        CmsPagesFormDescriptionHelperTextCreate:
          'Die Beschreibung wird von Suchmaschinen und sozialen Medien verwendet. Ziel: 160-165 Zeichen.',
        CmsPagesFormDescriptionHelperTextEdit:
          'Die Beschreibung wird von Suchmaschinen und sozialen Medien verwendet. Ziel: 160-165 Zeichen.',
        CmsPagesFormParentPageCreate: 'Wähle eine Elternseite',
        CmsPagesFormParentPageEdit: 'Die Elternseite der Seite',
        CmsPagesFormParentHelperTextCreate:
          'Dies ist die Elternseite der neuen Seite.',
        CmsPagesFormParentHelperTextEdit:
          'Du kannst die Seite einer passenderen Elternseite zuordnen.',
        CmsPagesFormImageCreate: 'Bild',
        CmsPagesFormImageEdit: 'Bild',
        CmsPagesFormImageHelperTextCreate:
          'Füge ein Bild zur Seite hinzu. Wenn keines gesetzt ist, wird das Bild der Elternseite oder der Website verwendet.',
        CmsPagesFormImageHelperTextEdit:
          'Das Bild der Seite. Wenn keines gesetzt ist, wird das Bild der Elternseite oder der Website verwendet.',
        CmsPagesFormPostCreate: 'Als Beitrag markieren',
        CmsPagesFormPostEdit: 'Beitrag',
        CmsPagesFormPostHelperTextCreate:
          'Markiere die Seite als Beitrag, um Datum und Autor zu nutzen.',
        CmsPagesFormPostHelperTextEdit:
          'Markiere die Seite als Beitrag, um Datum und Autor zu nutzen.',
        CmsPagesFormPostDateCreate: 'Veröffentlichungsdatum eingeben',
        CmsPagesFormPostDateEdit: 'Das Veröffentlichungsdatum der Seite',
        CmsPagesFormPostDateHelperTextCreate:
          'Das Datum wird zur Sortierung von Beiträgen verwendet.',
        CmsPagesFormPostDateHelperTextEdit:
          'Das Datum wird zur Sortierung von Beiträgen verwendet.',
        CmsPagesFormPostAuthorCreate: 'Autor der neuen Seite eingeben',
        CmsPagesFormPostAuthorEdit: 'Der Autor der Seite',
        CmsPagesFormPostAuthorHelperTextCreate:
          'Wird als Autor des Beitrags angezeigt.',
        CmsPagesFormPostAuthorHelperTextEdit:
          'Wird als Autor des Beitrags angezeigt.',
        CmsPagesFormPostCategoryCreate: 'Kategorie für die neue Seite eingeben',
        CmsPagesFormPostCategoryEdit: 'Die Kategorie der Seite',
        CmsPagesFormPostCategoryHelperTextCreate:
          'Die Kategorie dient zur Einteilung der Beiträge.',
        CmsPagesFormPostCategoryHelperTextEdit:
          'Die Kategorie dient zur Einteilung der Beiträge.',
        CmsPagesFormExcludeFromIndexCreate: 'Von Index ausschließen',
        CmsPagesFormExcludeFromIndexEdit: 'Von Index ausschließen',
        CmsPagesFormExcludeFromIndexHelperTextCreate:
          'Schließe diese Seite von allen Index-Feldern aus (z.B. überall, wo Seiten gelistet werden).',
        CmsPagesFormExcludeFromIndexHelperTextEdit:
          'Schließe diese Seite von allen Index-Feldern aus (z.B. überall, wo Seiten gelistet werden).',
        CmsPagesFormPlaceholdersTitle: 'Titel',
        CmsPagesFormPlaceholdersSlug: 'slug',
        CmsPagesFormPlaceholdersDescription: 'Beschreibung',
        CmsPagesFormPlaceholdersAuthor: 'Autor',
        CmsPagesFormPlaceholdersCategory: 'Kategorie',
        CmsPagesFormHelperMediaDescription:
          'Lade ein Bild hoch, das die Organisation repräsentiert.',
        CmsPagesFormErrorsSlugInUse: 'Slug wird bereits verwendet',
        CmsPagesFormErrorsParentRequired: 'Elternseite ist erforderlich',
        CmsPagesFormErrorsTemplateRequired: 'Template ist erforderlich',
        CmsPagesFormErrorsDateRequired: 'Datum ist für Beiträge erforderlich',
        CmsPagesFormErrorsAuthorRequired: 'Autor ist für Beiträge erforderlich',
        CmsPagesFormButtonsPreview: 'Vorschau',
        CmsPagesFormButtonsEdit: 'Seite bearbeiten',
        CmsPagesFormButtonsCancel: 'Abbrechen',
        CmsPagesFormButtonsCreate: 'Seite erstellen',
        CmsPagesFormButtonsSave: 'Seite speichern',

        CmsMediaTitle: 'Jaen CMS | Medien',
        CmsMediaMenuLabel: 'Medien',
        CmsMediaBreadcrumbsMedia: 'Medien',

        CmsSettingsTitle: 'Jaen CMS | Einstellungen',
        CmsSettingsMenuLabel: 'Einstellungen',
        CmsSettingsBreadcrumbsSettings: 'Einstellungen',
        CmsSettingsNotificationsUpdated: 'Einstellungen aktualisiert',
        CmsSettingsFormHeading: 'Einstellungen',
        CmsSettingsFormSiteInfoGroupTitle: 'Website-Informationen',
        CmsSettingsFormSiteInfoTitleLabel: 'Titel',
        CmsSettingsFormSiteInfoTitlePlaceholder: 'Titel',
        CmsSettingsFormSiteInfoTitleTooLong: 'Titel ist zu lang',
        CmsSettingsFormSiteInfoUrlLabel: 'URL',
        CmsSettingsFormSiteInfoUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormSiteInfoUrlInvalid:
          'URL muss mit http:// oder https:// beginnen',
        CmsSettingsFormSiteInfoDescriptionLabel: 'Beschreibung',
        CmsSettingsFormSiteInfoDescriptionPlaceholder:
          'Die Beschreibung, die in Suchmaschinen und sozialen Medien erscheint.',
        CmsSettingsFormSiteInfoDescriptionHelper:
          'Kurze Beschreibung für deine Website.',
        CmsSettingsFormSiteInfoImageLabel: 'Bild',
        CmsSettingsFormSiteInfoImageDescription:
          'Lade ein Bild hoch, das die Website repräsentiert.',
        CmsSettingsFormOrganisationGroupTitle: 'Organisation',
        CmsSettingsFormOrganisationNameLabel: 'Name',
        CmsSettingsFormOrganisationNamePlaceholder: 'Snek',
        CmsSettingsFormOrganisationNameTooLong: 'Name ist zu lang',
        CmsSettingsFormOrganisationUrlLabel: 'URL',
        CmsSettingsFormOrganisationUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormOrganisationUrlInvalid:
          'URL muss mit http:// oder https:// beginnen',
        CmsSettingsFormOrganisationLogoLabel: 'Bild',
        CmsSettingsFormOrganisationLogoDescription:
          'Lade ein Bild hoch, das die Organisation repräsentiert.',
        CmsSettingsFormCancel: 'Abbrechen',
        CmsSettingsFormSave: 'Speichern',

        CmsDebugTitle: 'Jaen CMS | Debug',
        CmsDebugBreadcrumbsDebug: 'Debug',

        CmsNotificationTitle: 'Jaen CMS | Benachrichtigung',
        CmsNotificationMenuLabel: 'Popup',
        CmsNotificationBreadcrumbsPopup: 'Popup'
      }
    }
  }

  if (code === 'tr-TR') {
    return {
      code,
      strings: {
        Language: 'Türkçe',

        AuthLogin: 'Giriş Yap',
        AuthSignup: 'Kaydol',
        AuthLogout: 'Çıkış Yap',
        AuthSettings: 'Ayarlar',

        CmsLabelsRoot: 'CMS',

        CmsDashboardTitle: 'Jaen CMS',
        CmsDashboardMenuLabel: 'Kontrol Paneli',
        CmsDashboardMenuGroupLabel: 'Jaen CMS',

        CmsPagesTitle: 'Jaen CMS | Sayfalar',
        CmsPagesMenuLabel: 'Sayfalar',

        CmsPagesBreadcrumbsPages: 'Sayfalar',
        CmsPagesBreadcrumbsNew: 'Yeni',

        CmsPagesNotificationsCreated: 'Sayfa oluşturuldu',
        CmsPagesNotificationsCreatedDescription:
          '“{title}” sayfası oluşturuldu',
        CmsPagesNotificationsUpdated: 'Sayfa güncellendi',
        CmsPagesNotificationsUpdatedDescription:
          '“{title}” sayfası güncellendi',
        CmsPagesNotificationsDeleted: 'Sayfa silindi',
        CmsPagesNotificationsDeletedDescription: '{slug} sayfası silindi',
        CmsPagesNotificationsDuplicated: 'Sayfa kopyalandı',
        CmsPagesNotificationsDuplicatedDescription: '{slug} sayfası kopyalandı',
        CmsPagesNotificationsMoved: 'Sayfa taşındı',
        CmsPagesNotificationsMovedDescription: '{slug} sayfası taşındı',
        CmsPagesNotificationsSlugUpdated: 'Slug güncellendi',
        CmsPagesNotificationsSlugUpdatedDescription:
          'Slug {slug} olarak güncellendi',
        CmsPagesNotificationsDuplicateFailed: 'Sayfa kopyalanamadı',
        CmsPagesNotificationsMoveFailed: 'Sayfa taşınamadı',
        CmsPagesNotificationsSlugUpdateFailed: 'Slug güncellenemedi',

        CmsPagesActionsDuplicate: 'Sayfayı kopyala',
        CmsPagesActionsMove: 'Sayfayı taşı',
        CmsPagesActionsUpdateSlug: 'Slugu güncelle',
        CmsPagesActionsRenameSlug: 'Slugu yeniden adlandır',
        CmsPagesActionsDelete: 'Sayfayı sil',
        CmsPagesActionsDeleteThis: 'Bu sayfayı sil',

        CmsPagesDescriptionsDuplicate:
          'Bu işlem sayfayı ve alt sayfalarını kopyalar.',
        CmsPagesDescriptionsMove:
          'Bu işlem sayfayı ve tüm alt sayfalarını taşır.',
        CmsPagesDescriptionsUpdateSlug:
          'Bu işlem slugu değiştirir ve sayfanın ve tüm alt sayfalarının yolunu etkiler.',
        CmsPagesDescriptionsDelete:
          'Bu işlem sayfayı ve tüm alt sayfalarını siler.',

        CmsPagesPromptsDuplicateTitle: 'Sayfayı kopyala',
        CmsPagesPromptsDuplicateMessage:
          'Kopyalanan sayfa için yeni bir slug girin. Bu işlem yolu etkileyecektir.',
        CmsPagesPromptsDuplicateConfirm: 'Kopyala',
        CmsPagesPromptsDuplicateCancel: 'İptal',
        CmsPagesPromptsDuplicatePlaceholder: '{slug}-kopya',

        CmsPagesPromptsMoveTitle: 'Sayfayı taşı',
        CmsPagesPromptsMoveMessage: 'Lütfen yeni bir üst sayfa seçin.',
        CmsPagesPromptsMoveConfirm: 'Taşı',
        CmsPagesPromptsMoveCancel: 'İptal',

        CmsPagesPromptsRenameSlugTitle: 'Slugu yeniden adlandır',
        CmsPagesPromptsRenameSlugMessage:
          'Lütfen yeni bir slug girin. Bu işlem yolu etkileyecektir.',
        CmsPagesPromptsRenameSlugConfirm: 'Yeniden adlandır',
        CmsPagesPromptsRenameSlugCancel: 'İptal',

        CmsPagesPromptsDeleteTitle: 'Sayfayı sil',
        CmsPagesPromptsDeleteMessage:
          'Bu sayfayı ve tüm alt sayfalarını silmek istediğinizden emin misiniz?',
        CmsPagesPromptsDeleteConfirm: 'Sil',

        CmsPagesTableSubpagesHeading: 'Alt sayfalar',
        CmsPagesTableReorderEnable: 'Yeniden sırala',
        CmsPagesTableReorderDisable: 'Bitti',
        CmsPagesTableNewPage: 'Yeni sayfa',
        CmsPagesTableColumnsTitle: 'Başlık',
        CmsPagesTableColumnsDescription: 'Açıklama',
        CmsPagesTableColumnsDate: 'Tarih',
        CmsPagesTableEmptyStateDescription:
          'Bu sayfanın henüz alt sayfası yok.',
        CmsPagesTableEmptyStateAction: 'Yeni bir sayfa oluştur',
        CmsPagesTableDateCreated:
          '{date} tarihinde {time} saatinde oluşturuldu',
        CmsPagesTableDateUpdated:
          'Son güncelleme {date} tarihinde {time} saatinde',
        CmsPagesTableDateEmpty: '-',
        CmsPagesTableReorderError:
          'Sayfalar yeniden sıralanırken bir sorun oluştu.',
        CmsPagesTableDangerZoneHeading: 'Tehlike bölgesi',

        CmsPagesLabelsNoTitle: 'Başlıksız',
        CmsPagesLabelsNoDescription: 'Açıklama yok',
        CmsPagesLabelsFallbackTitle: 'Sayfa',
        CmsPagesLabelsYes: 'Evet',

        CmsPagesFormHeadingCreate: 'Yeni sayfa oluştur',
        CmsPagesFormHeadingEdit: 'Sayfayı düzenle',
        CmsPagesFormLeadCreate:
          'Bir sayfa, belirli bir URL altında gösterilen alan veya blok düzenidir.',
        CmsPagesFormLeadEdit:
          'Sayfayı düzenleyin. SEO ve sosyal medya görünürlüğünü artırın.',
        CmsPagesFormTemplateCreate: 'Yeni sayfa için bir şablon seçin',
        CmsPagesFormTemplateEdit: 'Sayfanın şablonu',
        CmsPagesFormTemplateHelperTextCreate:
          'Bu şablon, üst sayfaya göre yeni sayfaya uygulanacaktır.',
        CmsPagesFormTemplateHelperTextEdit:
          'Şablonu değiştirmek istiyorsanız yeni bir sayfa oluşturup içeriği aktarın.',
        CmsPagesFormTitleCreate: 'Yeni sayfa için başlık girin',
        CmsPagesFormTitleEdit: 'Sayfanın başlığı',
        CmsPagesFormTitleHelperTextCreate:
          'Yeni sayfanın başlığı. URL slug başlıktan otomatik olarak oluşturulur.',
        CmsPagesFormTitleHelperTextEdit: 'Sayfanın başlığı.',
        CmsPagesFormDescriptionCreate: 'Yeni sayfa için açıklama ekleyin',
        CmsPagesFormDescriptionEdit: 'Sayfanın açıklaması',
        CmsPagesFormDescriptionHelperTextCreate:
          'Açıklama arama motorları ve sosyal medya tarafından kullanılır. 160-165 karakter hedefleyin.',
        CmsPagesFormDescriptionHelperTextEdit:
          'Açıklama arama motorları ve sosyal medya tarafından kullanılır. 160-165 karakter hedefleyin.',
        CmsPagesFormParentPageCreate: 'Bir üst sayfa seçin',
        CmsPagesFormParentPageEdit: 'Sayfanın üst sayfası',
        CmsPagesFormParentHelperTextCreate: 'Bu, yeni sayfanın üst sayfasıdır.',
        CmsPagesFormParentHelperTextEdit:
          'Sayfayı daha uygun bir üst sayfaya taşıyabilirsiniz.',
        CmsPagesFormImageCreate: 'Görsel',
        CmsPagesFormImageEdit: 'Görsel',
        CmsPagesFormImageHelperTextCreate:
          'Sayfaya bir görsel ekleyin. Boş bırakılırsa üst sayfanın veya sitenin görseli kullanılır.',
        CmsPagesFormImageHelperTextEdit:
          'Sayfanın görseli. Boş bırakılırsa üst sayfanın veya sitenin görseli kullanılır.',
        CmsPagesFormPostCreate: 'Yazı olarak işaretle',
        CmsPagesFormPostEdit: 'Yazı',
        CmsPagesFormPostHelperTextCreate:
          'Bu sayfayı yazı olarak işaretleyerek tarih ve yazar alanlarını ekleyin.',
        CmsPagesFormPostHelperTextEdit:
          'Bu sayfayı yazı olarak işaretleyerek tarih ve yazar alanlarını ekleyin.',
        CmsPagesFormPostDateCreate: 'Yeni sayfa için tarih girin',
        CmsPagesFormPostDateEdit: 'Sayfanın yayın tarihi',
        CmsPagesFormPostDateHelperTextCreate:
          'Tarih, yazı sıralamasında kullanılacaktır.',
        CmsPagesFormPostDateHelperTextEdit:
          'Tarih, yazı sıralamasında kullanılacaktır.',
        CmsPagesFormPostAuthorCreate: 'Yeni sayfa için yazar girin',
        CmsPagesFormPostAuthorEdit: 'Sayfanın yazarı',
        CmsPagesFormPostAuthorHelperTextCreate:
          'Yazı için yazar olarak gösterilecektir.',
        CmsPagesFormPostAuthorHelperTextEdit:
          'Yazı için yazar olarak gösterilecektir.',
        CmsPagesFormPostCategoryCreate: 'Yeni sayfa için kategori girin',
        CmsPagesFormPostCategoryEdit: 'Sayfanın kategorisi',
        CmsPagesFormPostCategoryHelperTextCreate:
          'Kategori, yazıları sınıflandırmak için kullanılır.',
        CmsPagesFormPostCategoryHelperTextEdit:
          'Kategori, yazıları sınıflandırmak için kullanılır.',
        CmsPagesFormExcludeFromIndexCreate: 'Dizinden çıkar',
        CmsPagesFormExcludeFromIndexEdit: 'Dizinden çıkar',
        CmsPagesFormExcludeFromIndexHelperTextCreate:
          'Bu sayfayı tüm dizin alanlarından hariç tut (ör. sayfaların listelendiği yerler).',
        CmsPagesFormExcludeFromIndexHelperTextEdit:
          'Bu sayfayı tüm dizin alanlarından hariç tut (ör. sayfaların listelendiği yerler).',
        CmsPagesFormPlaceholdersTitle: 'Başlık',
        CmsPagesFormPlaceholdersSlug: 'slug',
        CmsPagesFormPlaceholdersDescription: 'Açıklama',
        CmsPagesFormPlaceholdersAuthor: 'Yazar',
        CmsPagesFormPlaceholdersCategory: 'Kategori',
        CmsPagesFormHelperMediaDescription:
          'Kuruluşu temsil edecek bir görsel yükleyin.',
        CmsPagesFormErrorsSlugInUse: 'Slug zaten kullanılıyor',
        CmsPagesFormErrorsParentRequired: 'Üst sayfa gerekli',
        CmsPagesFormErrorsTemplateRequired: 'Şablon gerekli',
        CmsPagesFormErrorsDateRequired: 'Yazılar için tarih gereklidir',
        CmsPagesFormErrorsAuthorRequired: 'Yazılar için yazar gereklidir',
        CmsPagesFormButtonsPreview: 'Önizleme',
        CmsPagesFormButtonsEdit: 'Sayfayı düzenle',
        CmsPagesFormButtonsCancel: 'İptal',
        CmsPagesFormButtonsCreate: 'Sayfa oluştur',
        CmsPagesFormButtonsSave: 'Sayfayı kaydet',

        CmsMediaTitle: 'Jaen CMS | Medya',
        CmsMediaMenuLabel: 'Medya',
        CmsMediaBreadcrumbsMedia: 'Medya',

        CmsSettingsTitle: 'Jaen CMS | Ayarlar',
        CmsSettingsMenuLabel: 'Ayarlar',
        CmsSettingsBreadcrumbsSettings: 'Ayarlar',
        CmsSettingsNotificationsUpdated: 'Ayarlar güncellendi',
        CmsSettingsFormHeading: 'Ayarlar',
        CmsSettingsFormSiteInfoGroupTitle: 'Site Bilgileri',
        CmsSettingsFormSiteInfoTitleLabel: 'Başlık',
        CmsSettingsFormSiteInfoTitlePlaceholder: 'Başlık',
        CmsSettingsFormSiteInfoTitleTooLong: 'Başlık çok uzun',
        CmsSettingsFormSiteInfoUrlLabel: 'URL',
        CmsSettingsFormSiteInfoUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormSiteInfoUrlInvalid:
          'URL http:// veya https:// ile başlamalıdır',
        CmsSettingsFormSiteInfoDescriptionLabel: 'Açıklama',
        CmsSettingsFormSiteInfoDescriptionPlaceholder:
          'Arama motorlarında ve sosyal medyada görünen açıklama.',
        CmsSettingsFormSiteInfoDescriptionHelper:
          'Siteniz için kısa bir açıklama.',
        CmsSettingsFormSiteInfoImageLabel: 'Görsel',
        CmsSettingsFormSiteInfoImageDescription:
          'Siteyi temsil edecek bir görsel yükleyin.',
        CmsSettingsFormOrganisationGroupTitle: 'Organizasyon',
        CmsSettingsFormOrganisationNameLabel: 'Ad',
        CmsSettingsFormOrganisationNamePlaceholder: 'Snek',
        CmsSettingsFormOrganisationNameTooLong: 'Ad çok uzun',
        CmsSettingsFormOrganisationUrlLabel: 'URL',
        CmsSettingsFormOrganisationUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormOrganisationUrlInvalid:
          'URL http:// veya https:// ile başlamalıdır',
        CmsSettingsFormOrganisationLogoLabel: 'Görsel',
        CmsSettingsFormOrganisationLogoDescription:
          'Organizasyonu temsil edecek bir görsel yükleyin.',
        CmsSettingsFormCancel: 'İptal',
        CmsSettingsFormSave: 'Kaydet',

        CmsDebugTitle: 'Jaen CMS | Hata Ayıklama',
        CmsDebugBreadcrumbsDebug: 'Hata Ayıklama',

        CmsNotificationTitle: 'Jaen CMS | Bildirim',
        CmsNotificationMenuLabel: 'Bildirim',
        CmsNotificationBreadcrumbsPopup: 'Bildirim'
      }
    }
  }

  if (code === 'ar-EG') {
    return {
      code,
      strings: {
        Language: 'العربية',

        AuthLogin: 'تسجيل الدخول',
        AuthSignup: 'إنشاء حساب',
        AuthLogout: 'تسجيل الخروج',
        AuthSettings: 'الإعدادات',

        CmsLabelsRoot: 'نظام إدارة المحتوى',

        CmsDashboardTitle: 'Jaen CMS',
        CmsDashboardMenuLabel: 'لوحة التحكم',
        CmsDashboardMenuGroupLabel: 'Jaen CMS',

        CmsPagesTitle: 'Jaen CMS | الصفحات',
        CmsPagesMenuLabel: 'الصفحات',

        CmsPagesBreadcrumbsPages: 'الصفحات',
        CmsPagesBreadcrumbsNew: 'جديد',

        CmsPagesNotificationsCreated: 'تم إنشاء الصفحة',
        CmsPagesNotificationsCreatedDescription: 'تم إنشاء الصفحة {title}',
        CmsPagesNotificationsUpdated: 'تم تحديث الصفحة',
        CmsPagesNotificationsUpdatedDescription: 'تم تحديث الصفحة {title}',
        CmsPagesNotificationsDeleted: 'تم حذف الصفحة',
        CmsPagesNotificationsDeletedDescription: 'تم حذف الصفحة {slug}',
        CmsPagesNotificationsDuplicated: 'تم استنساخ الصفحة',
        CmsPagesNotificationsDuplicatedDescription: 'تم استنساخ الصفحة {slug}',
        CmsPagesNotificationsMoved: 'تم نقل الصفحة',
        CmsPagesNotificationsMovedDescription: 'تم نقل الصفحة {slug}',
        CmsPagesNotificationsSlugUpdated: 'تم تحديث الرابط',
        CmsPagesNotificationsSlugUpdatedDescription:
          'تم تحديث الرابط إلى {slug}',
        CmsPagesNotificationsDuplicateFailed: 'تعذّر استنساخ الصفحة',
        CmsPagesNotificationsMoveFailed: 'تعذّر نقل الصفحة',
        CmsPagesNotificationsSlugUpdateFailed: 'تعذّر تحديث الرابط',

        CmsPagesActionsDuplicate: 'استنساخ الصفحة',
        CmsPagesActionsMove: 'نقل الصفحة',
        CmsPagesActionsUpdateSlug: 'تحديث الرابط',
        CmsPagesActionsRenameSlug: 'إعادة تسمية الرابط',
        CmsPagesActionsDelete: 'حذف الصفحة',
        CmsPagesActionsDeleteThis: 'حذف هذه الصفحة',

        CmsPagesDescriptionsDuplicate:
          'سيؤدي ذلك إلى استنساخ الصفحة وجميع صفحاتها الفرعية.',
        CmsPagesDescriptionsMove:
          'سيؤدي ذلك إلى نقل الصفحة وجميع صفحاتها الفرعية.',
        CmsPagesDescriptionsUpdateSlug:
          'سيؤدي ذلك إلى إعادة تسمية الرابط وبالتالي يؤثر على مسار الصفحة وجميع صفحاتها الفرعية.',
        CmsPagesDescriptionsDelete:
          'سيؤدي ذلك إلى حذف الصفحة وجميع صفحاتها الفرعية.',

        CmsPagesPromptsDuplicateTitle: 'استنساخ الصفحة',
        CmsPagesPromptsDuplicateMessage:
          'يرجى إدخال رابط جديد للصفحة المستنسخة. سيؤثر ذلك على المسار.',
        CmsPagesPromptsDuplicateConfirm: 'استنساخ',
        CmsPagesPromptsDuplicateCancel: 'إلغاء',
        CmsPagesPromptsDuplicatePlaceholder: '{slug}-نسخة',

        CmsPagesPromptsMoveTitle: 'نقل الصفحة',
        CmsPagesPromptsMoveMessage: 'يرجى اختيار صفحة رئيسية جديدة.',
        CmsPagesPromptsMoveConfirm: 'نقل',
        CmsPagesPromptsMoveCancel: 'إلغاء',

        CmsPagesPromptsRenameSlugTitle: 'إعادة تسمية الرابط',
        CmsPagesPromptsRenameSlugMessage:
          'يرجى إدخال رابط جديد. سيؤثر ذلك على المسار.',
        CmsPagesPromptsRenameSlugConfirm: 'إعادة تسمية',
        CmsPagesPromptsRenameSlugCancel: 'إلغاء',

        CmsPagesPromptsDeleteTitle: 'حذف الصفحة',
        CmsPagesPromptsDeleteMessage:
          'هل أنت متأكد أنك تريد حذف هذه الصفحة وجميع صفحاتها الفرعية؟',
        CmsPagesPromptsDeleteConfirm: 'حذف',

        CmsPagesTableSubpagesHeading: 'الصفحات الفرعية',
        CmsPagesTableReorderEnable: 'إعادة الترتيب',
        CmsPagesTableReorderDisable: 'تم',
        CmsPagesTableNewPage: 'صفحة جديدة',
        CmsPagesTableColumnsTitle: 'العنوان',
        CmsPagesTableColumnsDescription: 'الوصف',
        CmsPagesTableColumnsDate: 'التاريخ',
        CmsPagesTableEmptyStateDescription:
          'لا تحتوي هذه الصفحة على أي صفحات فرعية بعد.',
        CmsPagesTableEmptyStateAction: 'أنشئ صفحة جديدة',
        CmsPagesTableDateCreated: 'تم الإنشاء في {date} الساعة {time}',
        CmsPagesTableDateUpdated: 'آخر تعديل في {date} الساعة {time}',
        CmsPagesTableDateEmpty: '-',
        CmsPagesTableReorderError: 'حدث خطأ أثناء إعادة ترتيب الصفحات.',
        CmsPagesTableDangerZoneHeading: 'منطقة الخطر',

        CmsPagesLabelsNoTitle: 'بدون عنوان',
        CmsPagesLabelsNoDescription: 'بدون وصف',
        CmsPagesLabelsFallbackTitle: 'صفحة',
        CmsPagesLabelsYes: 'نعم',

        CmsPagesFormHeadingCreate: 'إنشاء صفحة جديدة',
        CmsPagesFormHeadingEdit: 'تحرير الصفحة',
        CmsPagesFormLeadCreate:
          'تمثل الصفحة ترتيباً من الحقول أو الكتل يتم عرضه على عنوان URL محدد.',
        CmsPagesFormLeadEdit:
          'حرر الصفحة. عزّز تحسين محركات البحث والحضور على وسائل التواصل الاجتماعي.',
        CmsPagesFormTemplateCreate: 'اختر قالباً للصفحة الجديدة',
        CmsPagesFormTemplateEdit: 'القالب المستخدم للصفحة',
        CmsPagesFormTemplateHelperTextCreate:
          'سيتم تطبيق هذا القالب على الصفحة الجديدة بناءً على الصفحة الرئيسية.',
        CmsPagesFormTemplateHelperTextEdit:
          'إذا أردت تعديل القالب، أنشئ صفحة جديدة وانقل المحتوى.',
        CmsPagesFormTitleCreate: 'أدخل عنواناً للصفحة الجديدة',
        CmsPagesFormTitleEdit: 'عنوان الصفحة',
        CmsPagesFormTitleHelperTextCreate:
          'عنوان الصفحة الجديدة. سيتم إنشاء الرابط تلقائياً من العنوان.',
        CmsPagesFormTitleHelperTextEdit: 'عنوان الصفحة.',
        CmsPagesFormDescriptionCreate: 'قدّم وصفاً للصفحة الجديدة',
        CmsPagesFormDescriptionEdit: 'وصف الصفحة',
        CmsPagesFormDescriptionHelperTextCreate:
          'يُستخدم الوصف لمحركات البحث ووسائل التواصل الاجتماعي. استهدف 160-165 حرفاً.',
        CmsPagesFormDescriptionHelperTextEdit:
          'يُستخدم الوصف لمحركات البحث ووسائل التواصل الاجتماعي. استهدف 160-165 حرفاً.',
        CmsPagesFormParentPageCreate: 'اختر صفحة رئيسية',
        CmsPagesFormParentPageEdit: 'الصفحة الرئيسية لهذه الصفحة',
        CmsPagesFormParentHelperTextCreate:
          'تُعد هذه الصفحة الرئيسية للصفحة الجديدة.',
        CmsPagesFormParentHelperTextEdit:
          'يمكنك نقل الصفحة إلى صفحة رئيسية أكثر ملاءمة.',
        CmsPagesFormImageCreate: 'صورة',
        CmsPagesFormImageEdit: 'صورة',
        CmsPagesFormImageHelperTextCreate:
          'أضف صورة إلى الصفحة. إذا تُركت فارغة فسيتم استخدام صورة الصفحة الرئيسية أو الموقع.',
        CmsPagesFormImageHelperTextEdit:
          'صورة الصفحة. إذا تُركت فارغة فسيتم استخدام صورة الصفحة الرئيسية أو الموقع.',
        CmsPagesFormPostCreate: 'اعتبارها مقالة',
        CmsPagesFormPostEdit: 'مقالة',
        CmsPagesFormPostHelperTextCreate:
          'عيّن هذه الصفحة كمقالة لإضافة حقلي التاريخ والمؤلف.',
        CmsPagesFormPostHelperTextEdit:
          'عيّن هذه الصفحة كمقالة لإضافة حقلي التاريخ والمؤلف.',
        CmsPagesFormPostDateCreate: 'أدخل تاريخاً للصفحة الجديدة',
        CmsPagesFormPostDateEdit: 'تاريخ نشر الصفحة',
        CmsPagesFormPostDateHelperTextCreate: 'سيُستخدم التاريخ لفرز المقالات.',
        CmsPagesFormPostDateHelperTextEdit: 'سيُستخدم التاريخ لفرز المقالات.',
        CmsPagesFormPostAuthorCreate: 'أدخل مؤلف الصفحة الجديدة',
        CmsPagesFormPostAuthorEdit: 'مؤلف الصفحة',
        CmsPagesFormPostAuthorHelperTextCreate: 'سيظهر كمؤلف للمقالة.',
        CmsPagesFormPostAuthorHelperTextEdit: 'سيظهر كمؤلف للمقالة.',
        CmsPagesFormPostCategoryCreate: 'أدخل تصنيفاً للصفحة الجديدة',
        CmsPagesFormPostCategoryEdit: 'تصنيف الصفحة',
        CmsPagesFormPostCategoryHelperTextCreate:
          'يُستخدم التصنيف لتنظيم المقالات.',
        CmsPagesFormPostCategoryHelperTextEdit:
          'يُستخدم التصنيف لتنظيم المقالات.',
        CmsPagesFormExcludeFromIndexCreate: 'استبعاد من الفهرس',
        CmsPagesFormExcludeFromIndexEdit: 'استبعاد من الفهرس',
        CmsPagesFormExcludeFromIndexHelperTextCreate:
          'استبعد هذه الصفحة من جميع قوائم الفهرس (مثل الأماكن التي تُعرض فيها الصفحات).',
        CmsPagesFormExcludeFromIndexHelperTextEdit:
          'استبعد هذه الصفحة من جميع قوائم الفهرس (مثل الأماكن التي تُعرض فيها الصفحات).',
        CmsPagesFormPlaceholdersTitle: 'العنوان',
        CmsPagesFormPlaceholdersSlug: 'slug',
        CmsPagesFormPlaceholdersDescription: 'الوصف',
        CmsPagesFormPlaceholdersAuthor: 'المؤلف',
        CmsPagesFormPlaceholdersCategory: 'التصنيف',
        CmsPagesFormHelperMediaDescription: 'حمّل صورة تُمثّل المؤسسة.',
        CmsPagesFormErrorsSlugInUse: 'الرابط مستخدم بالفعل',
        CmsPagesFormErrorsParentRequired: 'الصفحة الرئيسية مطلوبة',
        CmsPagesFormErrorsTemplateRequired: 'القالب مطلوب',
        CmsPagesFormErrorsDateRequired: 'التاريخ مطلوب للمقالات',
        CmsPagesFormErrorsAuthorRequired: 'المؤلف مطلوب للمقالات',
        CmsPagesFormButtonsPreview: 'معاينة',
        CmsPagesFormButtonsEdit: 'تحرير الصفحة',
        CmsPagesFormButtonsCancel: 'إلغاء',
        CmsPagesFormButtonsCreate: 'إنشاء الصفحة',
        CmsPagesFormButtonsSave: 'حفظ الصفحة',

        CmsMediaTitle: 'Jaen CMS | الوسائط',
        CmsMediaMenuLabel: 'الوسائط',
        CmsMediaBreadcrumbsMedia: 'الوسائط',

        CmsSettingsTitle: 'Jaen CMS | الإعدادات',
        CmsSettingsMenuLabel: 'الإعدادات',
        CmsSettingsBreadcrumbsSettings: 'الإعدادات',
        CmsSettingsNotificationsUpdated: 'تم تحديث الإعدادات',
        CmsSettingsFormHeading: 'الإعدادات',
        CmsSettingsFormSiteInfoGroupTitle: 'معلومات الموقع',
        CmsSettingsFormSiteInfoTitleLabel: 'العنوان',
        CmsSettingsFormSiteInfoTitlePlaceholder: 'العنوان',
        CmsSettingsFormSiteInfoTitleTooLong: 'العنوان طويل جدًا',
        CmsSettingsFormSiteInfoUrlLabel: 'الرابط',
        CmsSettingsFormSiteInfoUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormSiteInfoUrlInvalid:
          'يجب أن يبدأ الرابط بـ http:// أو https://',
        CmsSettingsFormSiteInfoDescriptionLabel: 'الوصف',
        CmsSettingsFormSiteInfoDescriptionPlaceholder:
          'الوصف الذي يظهر في محركات البحث ووسائل التواصل الاجتماعي.',
        CmsSettingsFormSiteInfoDescriptionHelper: 'وصف موجز لموقعك.',
        CmsSettingsFormSiteInfoImageLabel: 'صورة',
        CmsSettingsFormSiteInfoImageDescription: 'حمّل صورة لتمثل الموقع.',
        CmsSettingsFormOrganisationGroupTitle: 'المنظمة',
        CmsSettingsFormOrganisationNameLabel: 'الاسم',
        CmsSettingsFormOrganisationNamePlaceholder: 'Snek',
        CmsSettingsFormOrganisationNameTooLong: 'الاسم طويل جدًا',
        CmsSettingsFormOrganisationUrlLabel: 'الرابط',
        CmsSettingsFormOrganisationUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormOrganisationUrlInvalid:
          'يجب أن يبدأ الرابط بـ http:// أو https://',
        CmsSettingsFormOrganisationLogoLabel: 'صورة',
        CmsSettingsFormOrganisationLogoDescription: 'حمّل صورة لتمثل المنظمة.',
        CmsSettingsFormCancel: 'إلغاء',
        CmsSettingsFormSave: 'حفظ',

        CmsDebugTitle: 'Jaen CMS | تتبع الأخطاء',
        CmsDebugBreadcrumbsDebug: 'تتبع الأخطاء',

        CmsNotificationTitle: 'Jaen CMS | الإشعارات',
        CmsNotificationMenuLabel: 'النوافذ المنبثقة',
        CmsNotificationBreadcrumbsPopup: 'الإشعار'
      }
    }
  }

  // EN fallback (defaults)
  return {
    code,
    strings: {
      Language: 'English',

      AuthLogin: 'Login',
      AuthSignup: 'Sign up',
      AuthLogout: 'Logout',
      AuthSettings: 'Settings',

      CmsLabelsRoot: 'CMS',

      CmsDashboardTitle: 'Jaen CMS',
      CmsDashboardMenuLabel: 'Dashboard',
      CmsDashboardMenuGroupLabel: 'Jaen CMS',

      CmsPagesTitle: 'Jaen CMS | Pages',
      CmsPagesMenuLabel: 'Pages',

      CmsPagesBreadcrumbsPages: 'Pages',
      CmsPagesBreadcrumbsNew: 'New',

      CmsPagesNotificationsCreated: 'Page created',
      CmsPagesNotificationsCreatedDescription: 'Page {title} has been created',
      CmsPagesNotificationsUpdated: 'Page updated',
      CmsPagesNotificationsUpdatedDescription: 'Page {title} has been updated',
      CmsPagesNotificationsDeleted: 'Page deleted',
      CmsPagesNotificationsDeletedDescription: 'Page {slug} has been deleted',
      CmsPagesNotificationsDuplicated: 'Page duplicated',
      CmsPagesNotificationsDuplicatedDescription:
        'Page {slug} has been duplicated',
      CmsPagesNotificationsMoved: 'Page moved',
      CmsPagesNotificationsMovedDescription: 'Page {slug} has been moved',
      CmsPagesNotificationsSlugUpdated: 'Slug updated',
      CmsPagesNotificationsSlugUpdatedDescription:
        'Slug has been updated to {slug}',
      CmsPagesNotificationsDuplicateFailed: 'Could not duplicate page',
      CmsPagesNotificationsMoveFailed: 'Could not move page',
      CmsPagesNotificationsSlugUpdateFailed: 'Could not update slug',

      CmsPagesActionsDuplicate: 'Duplicate page',
      CmsPagesActionsMove: 'Move page',
      CmsPagesActionsUpdateSlug: 'Update slug',
      CmsPagesActionsRenameSlug: 'Rename slug',
      CmsPagesActionsDelete: 'Delete page',
      CmsPagesActionsDeleteThis: 'Delete this page',

      CmsPagesDescriptionsDuplicate:
        'This will duplicate the page with its subpages.',
      CmsPagesDescriptionsMove: 'This will move the page and all its subpages.',
      CmsPagesDescriptionsUpdateSlug:
        'This will rename the slug and thus affects the path of the page and all its subpages.',
      CmsPagesDescriptionsDelete:
        'This will delete the page and all its subpages.',

      CmsPagesPromptsDuplicateTitle: 'Duplicate page',
      CmsPagesPromptsDuplicateMessage:
        'Please enter a new slug for the duplicated page. This will affect the path.',
      CmsPagesPromptsDuplicateConfirm: 'Duplicate',
      CmsPagesPromptsDuplicateCancel: 'Cancel',
      CmsPagesPromptsDuplicatePlaceholder: '{slug}-copy',

      CmsPagesPromptsMoveTitle: 'Move page',
      CmsPagesPromptsMoveMessage: 'Please select a new parent page.',
      CmsPagesPromptsMoveConfirm: 'Move',
      CmsPagesPromptsMoveCancel: 'Cancel',

      CmsPagesPromptsRenameSlugTitle: 'Rename slug',
      CmsPagesPromptsRenameSlugMessage:
        'Please enter a new slug. This will affect the path.',
      CmsPagesPromptsRenameSlugConfirm: 'Rename',
      CmsPagesPromptsRenameSlugCancel: 'Cancel',

      CmsPagesPromptsDeleteTitle: 'Delete page',
      CmsPagesPromptsDeleteMessage:
        'Are you sure you want to delete this page and all its subpages?',
      CmsPagesPromptsDeleteConfirm: 'Delete',

      CmsPagesTableSubpagesHeading: 'Subpages',
      CmsPagesTableReorderEnable: 'Reorder',
      CmsPagesTableReorderDisable: 'Done',
      CmsPagesTableNewPage: 'New page',
      CmsPagesTableColumnsTitle: 'Title',
      CmsPagesTableColumnsDescription: 'Description',
      CmsPagesTableColumnsDate: 'Date',
      CmsPagesTableEmptyStateDescription:
        "This page doesn't have any subpages yet.",
      CmsPagesTableEmptyStateAction: 'Create a new page',
      CmsPagesTableDateCreated: 'Created {date} at {time}',
      CmsPagesTableDateUpdated: 'Last modified {date} at {time}',
      CmsPagesTableDateEmpty: '-',
      CmsPagesTableReorderError:
        'Something went wrong while reordering the pages.',
      CmsPagesTableDangerZoneHeading: 'Danger zone',

      CmsPagesLabelsNoTitle: 'No title',
      CmsPagesLabelsNoDescription: 'No description',
      CmsPagesLabelsFallbackTitle: 'Page',
      CmsPagesLabelsYes: 'Yes',

      CmsPagesFormHeadingCreate: 'Create a New Page',
      CmsPagesFormHeadingEdit: 'Edit the Page',
      CmsPagesFormLeadCreate:
        'A page represents an arrangement of fields or blocks that are presented on a specific URL.',
      CmsPagesFormLeadEdit:
        'Edit the page. Enhance SEO and social media presence.',
      CmsPagesFormTemplateCreate: 'Select a Template for the New Page',
      CmsPagesFormTemplateEdit: 'The template used for the page',
      CmsPagesFormTemplateHelperTextCreate:
        'This template will be applied to the new page, based on the parent page.',
      CmsPagesFormTemplateHelperTextEdit:
        'If you wish to modify the template, create a new page and transfer the content.',
      CmsPagesFormTitleCreate: 'Enter a Title for the New Page',
      CmsPagesFormTitleEdit: 'The title of the page',
      CmsPagesFormTitleHelperTextCreate:
        'The title of the new page. The URL slug will be automatically generated from the title.',
      CmsPagesFormTitleHelperTextEdit: 'The title of the page.',
      CmsPagesFormDescriptionCreate: 'Provide a Description for the New Page',
      CmsPagesFormDescriptionEdit: 'The description of the page',
      CmsPagesFormDescriptionHelperTextCreate:
        'The description will be utilized by search engines and social media. Aim for 160-165 characters.',
      CmsPagesFormDescriptionHelperTextEdit:
        'The description will be utilized by search engines and social media. Aim for 160-165 characters.',
      CmsPagesFormParentPageCreate: 'Select a Parent Page',
      CmsPagesFormParentPageEdit: 'The parent page of the page',
      CmsPagesFormParentHelperTextCreate:
        'This serves as the parent page of the new page.',
      CmsPagesFormParentHelperTextEdit:
        'You have the option to relocate the page to a more suitable parent page.',
      CmsPagesFormImageCreate: 'Image',
      CmsPagesFormImageEdit: 'Image',
      CmsPagesFormImageHelperTextCreate:
        'Include an image on the page. If left unset, the image of the parent page or site will be utilized.',
      CmsPagesFormImageHelperTextEdit:
        'The image of the page. If left unset, the image of the parent page or site will be utilized.',
      CmsPagesFormPostCreate: 'Mark as a Post',
      CmsPagesFormPostEdit: 'Post',
      CmsPagesFormPostHelperTextCreate:
        'Designate this page as a post to incorporate a date and author field.',
      CmsPagesFormPostHelperTextEdit:
        'Designate this page as a post to incorporate a date and author field.',
      CmsPagesFormPostDateCreate: 'Enter a Date for the New Page',
      CmsPagesFormPostDateEdit: 'The publication date of the page',
      CmsPagesFormPostDateHelperTextCreate:
        'The date will be employed for post sorting.',
      CmsPagesFormPostDateHelperTextEdit:
        'The date will be employed for post sorting.',
      CmsPagesFormPostAuthorCreate: 'Enter an Author for the New Page',
      CmsPagesFormPostAuthorEdit: 'The author of the page',
      CmsPagesFormPostAuthorHelperTextCreate:
        'This will be displayed as the author of the post.',
      CmsPagesFormPostAuthorHelperTextEdit:
        'This will be displayed as the author of the post.',
      CmsPagesFormPostCategoryCreate: 'Enter a Category for the New Page',
      CmsPagesFormPostCategoryEdit: 'The category of the page',
      CmsPagesFormPostCategoryHelperTextCreate:
        'The category will be used for post classification.',
      CmsPagesFormPostCategoryHelperTextEdit:
        'The category will be used for post classification.',
      CmsPagesFormExcludeFromIndexCreate: 'Exclude from Index',
      CmsPagesFormExcludeFromIndexEdit: 'Exclude from Index',
      CmsPagesFormExcludeFromIndexHelperTextCreate:
        'Exclude this page from all index fields (e.g., locations where pages are listed).',
      CmsPagesFormExcludeFromIndexHelperTextEdit:
        'Exclude this page from all index fields (e.g., locations where pages are listed).',
      CmsPagesFormPlaceholdersTitle: 'Title',
      CmsPagesFormPlaceholdersSlug: 'slug',
      CmsPagesFormPlaceholdersDescription: 'Description',
      CmsPagesFormPlaceholdersAuthor: 'Author',
      CmsPagesFormPlaceholdersCategory: 'Category',
      CmsPagesFormHelperMediaDescription:
        'Upload a photo to represent the organization.',
      CmsPagesFormErrorsSlugInUse: 'Slug is already in use',
      CmsPagesFormErrorsParentRequired: 'Parent is required',
      CmsPagesFormErrorsTemplateRequired: 'Template is required',
      CmsPagesFormErrorsDateRequired: 'Date is required for blog posts',
      CmsPagesFormErrorsAuthorRequired: 'Author is required for blog posts',
      CmsPagesFormButtonsPreview: 'Preview',
      CmsPagesFormButtonsEdit: 'Edit page',
      CmsPagesFormButtonsCancel: 'Cancel',
      CmsPagesFormButtonsCreate: 'Create page',
      CmsPagesFormButtonsSave: 'Save page',

      CmsMediaTitle: 'Jaen CMS | Media',
      CmsMediaMenuLabel: 'Media',
      CmsMediaBreadcrumbsMedia: 'Media',

      CmsSettingsTitle: 'Jaen CMS | Settings',
      CmsSettingsMenuLabel: 'Settings',
      CmsSettingsBreadcrumbsSettings: 'Settings',
      CmsSettingsNotificationsUpdated: 'Settings updated',
      CmsSettingsFormHeading: 'Settings',
      CmsSettingsFormSiteInfoGroupTitle: 'Site Info',
      CmsSettingsFormSiteInfoTitleLabel: 'Title',
      CmsSettingsFormSiteInfoTitlePlaceholder: 'Title',
      CmsSettingsFormSiteInfoTitleTooLong: 'Title is too long',
      CmsSettingsFormSiteInfoUrlLabel: 'URL',
      CmsSettingsFormSiteInfoUrlPlaceholder: 'https://snek.at',
      CmsSettingsFormSiteInfoUrlInvalid:
        'URL must start with http:// or https://',
      CmsSettingsFormSiteInfoDescriptionLabel: 'Description',
      CmsSettingsFormSiteInfoDescriptionPlaceholder:
        'The description that appears in search engines and social media.',
      CmsSettingsFormSiteInfoDescriptionHelper:
        'Brief description for your site.',
      CmsSettingsFormSiteInfoImageLabel: 'Image',
      CmsSettingsFormSiteInfoImageDescription:
        'Upload a photo to represent the site.',
      CmsSettingsFormOrganisationGroupTitle: 'Organisation',
      CmsSettingsFormOrganisationNameLabel: 'Name',
      CmsSettingsFormOrganisationNamePlaceholder: 'Snek',
      CmsSettingsFormOrganisationNameTooLong: 'Name is too long',
      CmsSettingsFormOrganisationUrlLabel: 'URL',
      CmsSettingsFormOrganisationUrlPlaceholder: 'https://snek.at',
      CmsSettingsFormOrganisationUrlInvalid:
        'URL must start with http:// or https://',
      CmsSettingsFormOrganisationLogoLabel: 'Image',
      CmsSettingsFormOrganisationLogoDescription:
        'Upload a photo to represent the organization.',
      CmsSettingsFormCancel: 'Cancel',
      CmsSettingsFormSave: 'Save',

      CmsDebugTitle: 'Jaen CMS | Debug',
      CmsDebugBreadcrumbsDebug: 'Debug',

      CmsNotificationTitle: 'Jaen CMS | Notification',
      CmsNotificationMenuLabel: 'Popup',
      CmsNotificationBreadcrumbsPopup: 'Popup'
    }
  }
}
