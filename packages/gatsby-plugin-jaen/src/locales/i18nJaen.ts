// src/vars/i18nJaen.tsx
export type I18nCode =
  | 'en-US'
  | 'de-AT'
  | 'sl-SI'
  | 'it-IT'
  | 'ja-JP'
  | 'tr-TR'
  | 'ar-EG'

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

        CmsFrameStartEditing: 'Bearbeitung starten',
        CmsFrameStopEditing: 'Bearbeitung beenden',
        CmsFrameSaveDraft: 'Entwurf speichern',
        CmsFrameImportDraft: 'Entwurf importieren',
        CmsFrameDiscardChanges: 'Änderungen verwerfen',
        CmsFramePublish:
          '{isPublishing, select, true {Veröffentlichung läuft} other {Änderungen veröffentlichen}}',
        CmsFrameNewMedia: 'Neue Medien',
        CmsFrameGuest: 'Gast',
        CmsFrameNotificationsEditModeTitle: 'Bearbeitungsmodus',
        CmsFrameNotificationsEditModeOn: 'Du kannst die Seite jetzt bearbeiten',
        CmsFrameNotificationsEditModeOff:
          'Du kannst die Seite nicht mehr bearbeiten',
        CmsFrameNotificationsSaved: 'Gespeichert',
        CmsFrameNotificationsSavedDescription:
          'Deine Änderungen wurden gespeichert',
        CmsFrameNotificationsImported: 'Importiert',
        CmsFrameNotificationsImportedDescription:
          'Deine Änderungen wurden importiert',
        CmsFrameNotificationsImportFailed: 'Import fehlgeschlagen',
        CmsFrameNotificationsImportFailedDescription:
          'Deine Änderungen konnten nicht importiert werden',
        CmsFrameNotificationsDiscarded: 'Verworfen',
        CmsFrameNotificationsDiscardedDescription:
          'Deine Änderungen wurden verworfen',

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
        CmsNotificationBreadcrumbsPopup: 'Popup',
        CmsNotificationCardTitle: 'Benachrichtigungs-Popup',
        CmsNotificationCardDescription:
          'Konfiguriere das Benachrichtigungs-Popup. Die Benachrichtigung wird angezeigt, wenn der Benutzer die Seite besucht.',
        CmsNotificationPreview: 'Vorschau',
        CmsNotificationNotificationsUpdated: 'Benachrichtigung aktualisiert',
        CmsNotificationNotificationsUpdatedDescription:
          'Die Benachrichtigung wurde aktualisiert',
        CmsNotificationFormTitleLabel: 'Titel',
        CmsNotificationFormTitlePlaceholder: 'Neuigkeiten',
        CmsNotificationFormTitleDescription: 'Der Titel der Benachrichtigung',
        CmsNotificationFormMessageLabel: 'Nachricht',
        CmsNotificationFormMessageExample: 'Dies ist eine Beispielnachricht',
        CmsNotificationFormMessageDescription:
          'Die Nachricht der Benachrichtigung',
        CmsNotificationFormEnterUrl: 'URL eingeben',
        CmsNotificationFormFromLabel: 'Von',
        CmsNotificationFormFromDescription:
          'Die Benachrichtigung wird <b>nach</b> diesem Datum angezeigt',
        CmsNotificationFormToLabel: 'Bis',
        CmsNotificationFormToDescription:
          'Die Benachrichtigung wird <b>bis</b> zu diesem Datum angezeigt',
        CmsNotificationFormPickDate: 'Datum auswählen',
        CmsNotificationFormEnabledLabel:
          'Benachrichtigungs-Popup anzeigen, wenn der Benutzer die Seite besucht',
        CmsNotificationFormSubmit: 'Absenden',

        // Accounts
        CmsAccountsErrorsLoadService:
          'Benutzer konnten nicht vom Identitätsdienst geladen werden.',
        CmsAccountsErrorsLoadGeneric: 'Benutzer konnten nicht geladen werden.',
        CmsAccountsNotificationsCreated: 'Konto erstellt',
        CmsAccountsNotificationsCreatedDescription:
          'Konto {username} wurde erstellt',
        CmsAccountsNotificationsCreateFailed:
          'Konto konnte nicht erstellt werden',
        CmsAccountsTitle: 'Konten',
        CmsAccountsPageTitle: 'Jaen CMS | Konten',
        CmsAccountsMenuLabel: 'Konten',
        CmsAccountsBreadcrumbsAccounts: 'Konten',
        CmsAccountsSubtitle:
          'Durchsuche und verwalte die Benutzerkonten deines Identitätsmandanten.',
        CmsAccountsActionsCreate: 'Neues Konto',
        CmsAccountsSearchPlaceholder:
          'Nach Name, E-Mail oder Anmeldename suchen',
        CmsAccountsErrorsLoadTitle: 'Konten konnten nicht geladen werden',
        CmsAccountsCardUnnamed: 'Unbenannter Benutzer',
        CmsAccountsCardNoEmail: 'Keine E-Mail-Adresse hinterlegt',
        CmsAccountsCardUsername: 'Benutzername',
        CmsAccountsCardLoginNames: 'Anmeldenamen',
        CmsAccountsCardNoLoginNames: 'Keine weiteren Anmeldenamen',
        CmsAccountsCardManage: 'Konto verwalten',
        CmsAccountsEmptyTitle: 'Keine Konten entsprechen deiner Suche',
        CmsAccountsEmptyHint:
          'Passe den Suchbegriff an oder erstelle ein neues Konto.',
        CmsAccountsCreateTitle: 'Neues Konto erstellen',
        CmsAccountsCreateUsername: 'Benutzername',
        CmsAccountsCreateEmail: 'E-Mail',
        CmsAccountsCreateFirstName: 'Vorname',
        CmsAccountsCreateLastName: 'Nachname',
        CmsAccountsCreateInitialPassword: 'Initialpasswort (optional)',
        CmsAccountsCreateSendReset:
          'E-Mail zum Zurücksetzen des Passworts senden, wenn kein Passwort gesetzt ist',
        CmsAccountsActionsCancel: 'Abbrechen',
        CmsAccountsActionsCreateSubmit: 'Konto erstellen',
        CmsAccountsErrorsDetailService:
          'Das Benutzerprofil konnte nicht vom Identitätsdienst geladen werden.',
        CmsAccountsErrorsDetailGeneric:
          'Das Benutzerprofil konnte nicht geladen werden.',
        CmsAccountsNotificationsActionFailed: 'Aktion fehlgeschlagen',
        CmsAccountsNotificationsSaved: 'Änderungen gespeichert',
        CmsAccountsNotificationsSavedDescription:
          'Das Profil wurde aktualisiert.',
        CmsAccountsNotificationsSaveFailed: 'Speichern fehlgeschlagen',
        CmsAccountsNotificationsDeleted: 'Konto gelöscht',
        CmsAccountsNotificationsPasswordSet: 'Passwort gesetzt',
        CmsAccountsNotificationsRolesUpdated: 'Rollen aktualisiert',
        CmsAccountsDetailBack: 'Zurück zu den Konten',
        CmsAccountsErrorsDetailTitle:
          'Dieses Konto konnte nicht geladen werden',
        CmsAccountsDetailNoEmail: 'Keine primäre E-Mail-Adresse hinterlegt',
        CmsAccountsDetailUsername: 'Benutzername',
        CmsAccountsDetailPreferredLogin: 'Bevorzugter Anmeldename',
        CmsAccountsDetailState: 'Kontostatus',
        CmsAccountsDetailCreated: 'Erstellt',
        CmsAccountsDetailLastChange: 'Letzte Änderung',
        CmsAccountsDetailResourceOwner: 'Organisation',
        CmsAccountsProfileTitle: 'Profil',
        CmsAccountsProfileDisplayName: 'Anzeigename',
        CmsAccountsProfileLanguage: 'Bevorzugte Sprache',
        CmsAccountsProfileFirstName: 'Vorname',
        CmsAccountsProfileLastName: 'Nachname',
        CmsAccountsProfileEmail: 'E-Mail',
        CmsAccountsProfilePhone: 'Telefon',
        CmsAccountsProfileReset: 'Zurücksetzen',
        CmsAccountsProfileSave: 'Änderungen speichern',
        CmsAccountsRolesTitle: 'Projektrollen',
        CmsAccountsRolesGrant: 'Rollen zuweisen',
        CmsAccountsRolesEdit: 'Bearbeiten',
        CmsAccountsNotificationsRolesRevoked: 'Rollen entzogen',
        CmsAccountsRolesRevoke: 'Entziehen',
        CmsAccountsRolesEmpty: 'Keine Projektrollen zugewiesen.',
        CmsAccountsActionsTitle: 'Kontoaktionen',
        CmsAccountsActionsSetPassword: 'Passwort setzen',
        CmsAccountsNotificationsResetRequested:
          'Zurücksetzen des Passworts angefordert',
        CmsAccountsActionsRequestReset: 'Zurücksetzen des Passworts anfordern',
        CmsAccountsNotificationsVerificationSent:
          'Verifizierungs-E-Mail gesendet',
        CmsAccountsActionsResendVerification:
          'E-Mail-Verifizierung erneut senden',
        CmsAccountsNotificationsDeactivated: 'Konto deaktiviert',
        CmsAccountsActionsDeactivate: 'Deaktivieren',
        CmsAccountsNotificationsReactivated: 'Konto reaktiviert',
        CmsAccountsActionsReactivate: 'Reaktivieren',
        CmsAccountsNotificationsUnlocked: 'Konto entsperrt',
        CmsAccountsActionsUnlock: 'Entsperren',
        CmsAccountsNotificationsLocked: 'Konto gesperrt',
        CmsAccountsActionsLock: 'Sperren',
        CmsAccountsActionsDelete: 'Konto löschen',
        CmsAccountsDeleteTitle: 'Konto löschen',
        CmsAccountsDeletePrompt:
          'Bist du sicher, dass du {username} löschen möchtest? Dies kann nicht rückgängig gemacht werden.',
        CmsAccountsPasswordTitle: 'Neues Passwort setzen',
        CmsAccountsPasswordNew: 'Neues Passwort',
        CmsAccountsPasswordChangeRequired:
          'Passwortänderung bei der nächsten Anmeldung verlangen',
        CmsAccountsRolesEditTitle: 'Zugewiesene Rollen bearbeiten',
        CmsAccountsRolesGrantTitle: 'Projektrollen zuweisen',
        CmsAccountsRolesProject: 'Projekt',
        CmsAccountsRolesNoneAvailable:
          'Für dieses Projekt sind keine Rollen verfügbar.',
        CmsAccountsRolesSave: 'Rollen speichern'
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

        CmsFrameStartEditing: 'Düzenlemeyi başlat',
        CmsFrameStopEditing: 'Düzenlemeyi durdur',
        CmsFrameSaveDraft: 'Taslağı kaydet',
        CmsFrameImportDraft: 'Taslağı içe aktar',
        CmsFrameDiscardChanges: 'Değişiklikleri at',
        CmsFramePublish:
          '{isPublishing, select, true {Yayımlanıyor} other {Değişiklikleri yayımla}}',
        CmsFrameNewMedia: 'Yeni medya',
        CmsFrameGuest: 'Misafir',
        CmsFrameNotificationsEditModeTitle: 'Düzenleme modu',
        CmsFrameNotificationsEditModeOn: 'Sayfayı artık düzenleyebilirsiniz',
        CmsFrameNotificationsEditModeOff: 'Sayfayı artık düzenleyemezsiniz',
        CmsFrameNotificationsSaved: 'Kaydedildi',
        CmsFrameNotificationsSavedDescription: 'Değişiklikleriniz kaydedildi',
        CmsFrameNotificationsImported: 'İçe aktarıldı',
        CmsFrameNotificationsImportedDescription:
          'Değişiklikleriniz içe aktarıldı',
        CmsFrameNotificationsImportFailed: 'İçe aktarma başarısız',
        CmsFrameNotificationsImportFailedDescription:
          'Değişiklikleriniz içe aktarılamadı',
        CmsFrameNotificationsDiscarded: 'Atıldı',
        CmsFrameNotificationsDiscardedDescription: 'Değişiklikleriniz atıldı',

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
        CmsNotificationBreadcrumbsPopup: 'Bildirim',
        CmsNotificationCardTitle: 'Bildirim Açılır Penceresi',
        CmsNotificationCardDescription:
          'Bildirim açılır penceresini yapılandırın. Bildirim, kullanıcı sayfayı ziyaret ettiğinde gösterilir.',
        CmsNotificationPreview: 'Önizleme',
        CmsNotificationNotificationsUpdated: 'Bildirim güncellendi',
        CmsNotificationNotificationsUpdatedDescription:
          'Bildirim başarıyla güncellendi',
        CmsNotificationFormTitleLabel: 'Başlık',
        CmsNotificationFormTitlePlaceholder: 'Haberler',
        CmsNotificationFormTitleDescription: 'Bildirimin başlığı',
        CmsNotificationFormMessageLabel: 'Mesaj',
        CmsNotificationFormMessageExample: 'Bu bir örnek mesajdır',
        CmsNotificationFormMessageDescription: 'Bildirimin mesajı',
        CmsNotificationFormEnterUrl: 'URL\'yi girin',
        CmsNotificationFormFromLabel: 'Başlangıç',
        CmsNotificationFormFromDescription:
          'Bildirim bu tarihten <b>sonra</b> gösterilir',
        CmsNotificationFormToLabel: 'Bitiş',
        CmsNotificationFormToDescription:
          'Bildirim bu tarihe <b>kadar</b> gösterilir',
        CmsNotificationFormPickDate: 'Bir tarih seçin',
        CmsNotificationFormEnabledLabel:
          'Kullanıcı sayfayı ziyaret ettiğinde bildirim açılır penceresini göster',
        CmsNotificationFormSubmit: 'Gönder',

        // Accounts
        CmsAccountsErrorsLoadService:
          'Kullanıcılar kimlik servisinden yüklenemedi.',
        CmsAccountsErrorsLoadGeneric: 'Kullanıcılar yüklenemedi.',
        CmsAccountsNotificationsCreated: 'Hesap oluşturuldu',
        CmsAccountsNotificationsCreatedDescription:
          '{username} hesabı oluşturuldu',
        CmsAccountsNotificationsCreateFailed: 'Hesap oluşturulamadı',
        CmsAccountsTitle: 'Hesaplar',
        CmsAccountsPageTitle: 'Jaen CMS | Hesaplar',
        CmsAccountsMenuLabel: 'Hesaplar',
        CmsAccountsBreadcrumbsAccounts: 'Hesaplar',
        CmsAccountsSubtitle:
          'Kimlik kiracınızdaki kullanıcı hesaplarına göz atın ve bunları yönetin.',
        CmsAccountsActionsCreate: 'Yeni hesap',
        CmsAccountsSearchPlaceholder:
          'Ada, e-postaya veya giriş adına göre ara',
        CmsAccountsErrorsLoadTitle: 'Hesaplar yüklenemedi',
        CmsAccountsCardUnnamed: 'Adsız kullanıcı',
        CmsAccountsCardNoEmail: 'E-posta belirtilmemiş',
        CmsAccountsCardUsername: 'Kullanıcı adı',
        CmsAccountsCardLoginNames: 'Giriş adları',
        CmsAccountsCardNoLoginNames: 'Alternatif giriş adı yok',
        CmsAccountsCardManage: 'Hesabı yönet',
        CmsAccountsEmptyTitle: 'Aramanızla eşleşen hesap yok',
        CmsAccountsEmptyHint:
          'Arama terimini değiştirin veya yeni bir hesap oluşturun.',
        CmsAccountsCreateTitle: 'Yeni hesap oluştur',
        CmsAccountsCreateUsername: 'Kullanıcı adı',
        CmsAccountsCreateEmail: 'E-posta',
        CmsAccountsCreateFirstName: 'Ad',
        CmsAccountsCreateLastName: 'Soyad',
        CmsAccountsCreateInitialPassword: 'Başlangıç parolası (isteğe bağlı)',
        CmsAccountsCreateSendReset:
          'Parola belirlenmediğinde parola sıfırlama e-postası gönder',
        CmsAccountsActionsCancel: 'İptal',
        CmsAccountsActionsCreateSubmit: 'Hesap oluştur',
        CmsAccountsErrorsDetailService:
          'Kullanıcı profili kimlik servisinden yüklenemedi.',
        CmsAccountsErrorsDetailGeneric: 'Kullanıcı profili yüklenemedi.',
        CmsAccountsNotificationsActionFailed: 'İşlem başarısız',
        CmsAccountsNotificationsSaved: 'Değişiklikler kaydedildi',
        CmsAccountsNotificationsSavedDescription: 'Profil güncellendi.',
        CmsAccountsNotificationsSaveFailed: 'Kaydetme başarısız',
        CmsAccountsNotificationsDeleted: 'Hesap silindi',
        CmsAccountsNotificationsPasswordSet: 'Parola belirlendi',
        CmsAccountsNotificationsRolesUpdated: 'Roller güncellendi',
        CmsAccountsDetailBack: 'Hesaplara geri dön',
        CmsAccountsErrorsDetailTitle: 'Bu hesap yüklenemedi',
        CmsAccountsDetailNoEmail: 'Birincil e-posta belirtilmemiş',
        CmsAccountsDetailUsername: 'Kullanıcı adı',
        CmsAccountsDetailPreferredLogin: 'Tercih edilen giriş adı',
        CmsAccountsDetailState: 'Hesap durumu',
        CmsAccountsDetailCreated: 'Oluşturulma',
        CmsAccountsDetailLastChange: 'Son değişiklik',
        CmsAccountsDetailResourceOwner: 'Kuruluş',
        CmsAccountsProfileTitle: 'Profil',
        CmsAccountsProfileDisplayName: 'Görünen ad',
        CmsAccountsProfileLanguage: 'Tercih edilen dil',
        CmsAccountsProfileFirstName: 'Ad',
        CmsAccountsProfileLastName: 'Soyad',
        CmsAccountsProfileEmail: 'E-posta',
        CmsAccountsProfilePhone: 'Telefon',
        CmsAccountsProfileReset: 'Sıfırla',
        CmsAccountsProfileSave: 'Değişiklikleri kaydet',
        CmsAccountsRolesTitle: 'Proje rolleri',
        CmsAccountsRolesGrant: 'Rol ata',
        CmsAccountsRolesEdit: 'Düzenle',
        CmsAccountsNotificationsRolesRevoked: 'Roller kaldırıldı',
        CmsAccountsRolesRevoke: 'Kaldır',
        CmsAccountsRolesEmpty: 'Atanmış proje rolü yok.',
        CmsAccountsActionsTitle: 'Hesap işlemleri',
        CmsAccountsActionsSetPassword: 'Parola belirle',
        CmsAccountsNotificationsResetRequested: 'Parola sıfırlama talep edildi',
        CmsAccountsActionsRequestReset: 'Parola sıfırlama talep et',
        CmsAccountsNotificationsVerificationSent:
          'Doğrulama e-postası gönderildi',
        CmsAccountsActionsResendVerification:
          'E-posta doğrulamasını yeniden gönder',
        CmsAccountsNotificationsDeactivated: 'Hesap devre dışı bırakıldı',
        CmsAccountsActionsDeactivate: 'Devre dışı bırak',
        CmsAccountsNotificationsReactivated: 'Hesap yeniden etkinleştirildi',
        CmsAccountsActionsReactivate: 'Yeniden etkinleştir',
        CmsAccountsNotificationsUnlocked: 'Hesabın kilidi açıldı',
        CmsAccountsActionsUnlock: 'Kilidi aç',
        CmsAccountsNotificationsLocked: 'Hesap kilitlendi',
        CmsAccountsActionsLock: 'Kilitle',
        CmsAccountsActionsDelete: 'Hesabı sil',
        CmsAccountsDeleteTitle: 'Hesabı sil',
        CmsAccountsDeletePrompt:
          '{username} hesabını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
        CmsAccountsPasswordTitle: 'Yeni parola belirle',
        CmsAccountsPasswordNew: 'Yeni parola',
        CmsAccountsPasswordChangeRequired:
          'Bir sonraki girişte değiştirilmesini zorunlu kıl',
        CmsAccountsRolesEditTitle: 'Atanmış rolleri düzenle',
        CmsAccountsRolesGrantTitle: 'Proje rolleri ata',
        CmsAccountsRolesProject: 'Proje',
        CmsAccountsRolesNoneAvailable: 'Bu proje için kullanılabilir rol yok.',
        CmsAccountsRolesSave: 'Rolleri kaydet'
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

        CmsFrameStartEditing: 'بدء التحرير',
        CmsFrameStopEditing: 'إيقاف التحرير',
        CmsFrameSaveDraft: 'حفظ المسودة',
        CmsFrameImportDraft: 'استيراد المسودة',
        CmsFrameDiscardChanges: 'تجاهل التغييرات',
        CmsFramePublish:
          '{isPublishing, select, true {جارٍ النشر} other {نشر التغييرات}}',
        CmsFrameNewMedia: 'وسائط جديدة',
        CmsFrameGuest: 'ضيف',
        CmsFrameNotificationsEditModeTitle: 'وضع التحرير',
        CmsFrameNotificationsEditModeOn: 'يمكنك الآن تحرير الصفحة',
        CmsFrameNotificationsEditModeOff: 'لم يعد بإمكانك تحرير الصفحة',
        CmsFrameNotificationsSaved: 'تم الحفظ',
        CmsFrameNotificationsSavedDescription: 'تم حفظ تغييراتك',
        CmsFrameNotificationsImported: 'تم الاستيراد',
        CmsFrameNotificationsImportedDescription: 'تم استيراد تغييراتك',
        CmsFrameNotificationsImportFailed: 'تعذّر الاستيراد',
        CmsFrameNotificationsImportFailedDescription: 'تعذّر استيراد تغييراتك',
        CmsFrameNotificationsDiscarded: 'تم التجاهل',
        CmsFrameNotificationsDiscardedDescription: 'تم تجاهل تغييراتك',

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
        CmsNotificationBreadcrumbsPopup: 'الإشعار',
        CmsNotificationCardTitle: 'نافذة الإشعار المنبثقة',
        CmsNotificationCardDescription:
          'قم بإعداد نافذة الإشعار المنبثقة. سيظهر الإشعار عند زيارة المستخدم للصفحة.',
        CmsNotificationPreview: 'معاينة',
        CmsNotificationNotificationsUpdated: 'تم تحديث الإشعار',
        CmsNotificationNotificationsUpdatedDescription: 'لقد تم تحديث الإشعار',
        CmsNotificationFormTitleLabel: 'العنوان',
        CmsNotificationFormTitlePlaceholder: 'أخبار',
        CmsNotificationFormTitleDescription: 'عنوان الإشعار',
        CmsNotificationFormMessageLabel: 'الرسالة',
        CmsNotificationFormMessageExample: 'هذه رسالة توضيحية',
        CmsNotificationFormMessageDescription: 'رسالة الإشعار',
        CmsNotificationFormEnterUrl: 'أدخل الرابط',
        CmsNotificationFormFromLabel: 'من',
        CmsNotificationFormFromDescription:
          'سيظهر الإشعار <b>بعد</b> هذا التاريخ',
        CmsNotificationFormToLabel: 'إلى',
        CmsNotificationFormToDescription:
          'سيظهر الإشعار <b>حتى</b> هذا التاريخ',
        CmsNotificationFormPickDate: 'اختر تاريخاً',
        CmsNotificationFormEnabledLabel:
          'إظهار نافذة الإشعار المنبثقة عند زيارة المستخدم للصفحة',
        CmsNotificationFormSubmit: 'إرسال',

        // Accounts
        CmsAccountsErrorsLoadService: 'تعذّر تحميل المستخدمين من خدمة الهوية.',
        CmsAccountsErrorsLoadGeneric: 'تعذّر تحميل المستخدمين.',
        CmsAccountsNotificationsCreated: 'تم إنشاء الحساب',
        CmsAccountsNotificationsCreatedDescription:
          'تم إنشاء الحساب {username}',
        CmsAccountsNotificationsCreateFailed: 'تعذّر إنشاء الحساب',
        CmsAccountsTitle: 'الحسابات',
        CmsAccountsPageTitle: 'Jaen CMS | الحسابات',
        CmsAccountsMenuLabel: 'الحسابات',
        CmsAccountsBreadcrumbsAccounts: 'الحسابات',
        CmsAccountsSubtitle:
          'تصفح وأدر حسابات المستخدمين في مستأجر الهوية الخاص بك.',
        CmsAccountsActionsCreate: 'حساب جديد',
        CmsAccountsSearchPlaceholder:
          'ابحث بالاسم أو البريد الإلكتروني أو اسم الدخول',
        CmsAccountsErrorsLoadTitle: 'تعذّر تحميل الحسابات',
        CmsAccountsCardUnnamed: 'مستخدم بدون اسم',
        CmsAccountsCardNoEmail: 'لا يوجد بريد إلكتروني',
        CmsAccountsCardUsername: 'اسم المستخدم',
        CmsAccountsCardLoginNames: 'أسماء تسجيل الدخول',
        CmsAccountsCardNoLoginNames: 'لا توجد أسماء دخول بديلة',
        CmsAccountsCardManage: 'إدارة الحساب',
        CmsAccountsEmptyTitle: 'لا توجد حسابات مطابقة لبحثك',
        CmsAccountsEmptyHint: 'عدّل مصطلح البحث أو أنشئ حساباً جديداً.',
        CmsAccountsCreateTitle: 'إنشاء حساب جديد',
        CmsAccountsCreateUsername: 'اسم المستخدم',
        CmsAccountsCreateEmail: 'البريد الإلكتروني',
        CmsAccountsCreateFirstName: 'الاسم الأول',
        CmsAccountsCreateLastName: 'اسم العائلة',
        CmsAccountsCreateInitialPassword: 'كلمة المرور الأولية (اختياري)',
        CmsAccountsCreateSendReset:
          'إرسال بريد إعادة تعيين كلمة المرور عند عدم تعيين كلمة مرور',
        CmsAccountsActionsCancel: 'إلغاء',
        CmsAccountsActionsCreateSubmit: 'إنشاء الحساب',
        CmsAccountsErrorsDetailService:
          'تعذّر تحميل الملف الشخصي للمستخدم من خدمة الهوية.',
        CmsAccountsErrorsDetailGeneric: 'تعذّر تحميل الملف الشخصي للمستخدم.',
        CmsAccountsNotificationsActionFailed: 'فشل الإجراء',
        CmsAccountsNotificationsSaved: 'تم حفظ التغييرات',
        CmsAccountsNotificationsSavedDescription: 'تم تحديث الملف الشخصي.',
        CmsAccountsNotificationsSaveFailed: 'تعذّر الحفظ',
        CmsAccountsNotificationsDeleted: 'تم حذف الحساب',
        CmsAccountsNotificationsPasswordSet: 'تم تعيين كلمة المرور',
        CmsAccountsNotificationsRolesUpdated: 'تم تحديث الأدوار',
        CmsAccountsDetailBack: 'العودة إلى الحسابات',
        CmsAccountsErrorsDetailTitle: 'تعذّر تحميل هذا الحساب',
        CmsAccountsDetailNoEmail: 'لا يوجد بريد إلكتروني أساسي',
        CmsAccountsDetailUsername: 'اسم المستخدم',
        CmsAccountsDetailPreferredLogin: 'اسم الدخول المفضل',
        CmsAccountsDetailState: 'حالة الحساب',
        CmsAccountsDetailCreated: 'تاريخ الإنشاء',
        CmsAccountsDetailLastChange: 'آخر تعديل',
        CmsAccountsDetailResourceOwner: 'المنظمة',
        CmsAccountsProfileTitle: 'الملف الشخصي',
        CmsAccountsProfileDisplayName: 'الاسم المعروض',
        CmsAccountsProfileLanguage: 'اللغة المفضلة',
        CmsAccountsProfileFirstName: 'الاسم الأول',
        CmsAccountsProfileLastName: 'اسم العائلة',
        CmsAccountsProfileEmail: 'البريد الإلكتروني',
        CmsAccountsProfilePhone: 'الهاتف',
        CmsAccountsProfileReset: 'إعادة تعيين',
        CmsAccountsProfileSave: 'حفظ التغييرات',
        CmsAccountsRolesTitle: 'أدوار المشروع',
        CmsAccountsRolesGrant: 'منح أدوار',
        CmsAccountsRolesEdit: 'تحرير',
        CmsAccountsNotificationsRolesRevoked: 'تم سحب الأدوار',
        CmsAccountsRolesRevoke: 'سحب',
        CmsAccountsRolesEmpty: 'لم تُمنح أي أدوار للمشروع.',
        CmsAccountsActionsTitle: 'إجراءات الحساب',
        CmsAccountsActionsSetPassword: 'تعيين كلمة المرور',
        CmsAccountsNotificationsResetRequested:
          'تم طلب إعادة تعيين كلمة المرور',
        CmsAccountsActionsRequestReset: 'طلب إعادة تعيين كلمة المرور',
        CmsAccountsNotificationsVerificationSent: 'تم إرسال بريد التحقق',
        CmsAccountsActionsResendVerification: 'إعادة إرسال بريد التحقق',
        CmsAccountsNotificationsDeactivated: 'تم تعطيل الحساب',
        CmsAccountsActionsDeactivate: 'تعطيل',
        CmsAccountsNotificationsReactivated: 'تمت إعادة تفعيل الحساب',
        CmsAccountsActionsReactivate: 'إعادة تفعيل',
        CmsAccountsNotificationsUnlocked: 'تم فتح قفل الحساب',
        CmsAccountsActionsUnlock: 'فتح القفل',
        CmsAccountsNotificationsLocked: 'تم قفل الحساب',
        CmsAccountsActionsLock: 'قفل',
        CmsAccountsActionsDelete: 'حذف الحساب',
        CmsAccountsDeleteTitle: 'حذف الحساب',
        CmsAccountsDeletePrompt:
          'هل أنت متأكد أنك تريد حذف {username}؟ لا يمكن التراجع عن هذا الإجراء.',
        CmsAccountsPasswordTitle: 'تعيين كلمة مرور جديدة',
        CmsAccountsPasswordNew: 'كلمة المرور الجديدة',
        CmsAccountsPasswordChangeRequired:
          'طلب تغيير كلمة المرور عند تسجيل الدخول التالي',
        CmsAccountsRolesEditTitle: 'تحرير الأدوار الممنوحة',
        CmsAccountsRolesGrantTitle: 'منح أدوار المشروع',
        CmsAccountsRolesProject: 'المشروع',
        CmsAccountsRolesNoneAvailable: 'لا توجد أدوار متاحة لهذا المشروع.',
        CmsAccountsRolesSave: 'حفظ الأدوار'
      }
    }
  }

  // EN fallback (defaults)
  if (code === 'sl-SI') {
    return {
      code,
      strings: {
        Language: 'Slovenščina',

        AuthLogin: 'Prijava',
        AuthSignup: 'Registracija',
        AuthLogout: 'Odjava',
        AuthSettings: 'Nastavitve',

        CmsLabelsRoot: 'CMS',

        CmsDashboardTitle: 'Jaen CMS',
        CmsDashboardMenuLabel: 'Nadzorna plošča',
        CmsDashboardMenuGroupLabel: 'Jaen CMS',

        CmsFrameStartEditing: 'Začni urejanje',
        CmsFrameStopEditing: 'Končaj urejanje',
        CmsFrameSaveDraft: 'Shrani osnutek',
        CmsFrameImportDraft: 'Uvozi osnutek',
        CmsFrameDiscardChanges: 'Zavrzi spremembe',
        CmsFramePublish:
          '{isPublishing, select, true {Objavljanje poteka} other {Objavi spremembe}}',
        CmsFrameNewMedia: 'Nova predstavnost',
        CmsFrameGuest: 'Gost',
        CmsFrameNotificationsEditModeTitle: 'Način urejanja',
        CmsFrameNotificationsEditModeOn: 'Zdaj lahko urejate stran',
        CmsFrameNotificationsEditModeOff: 'Strani ne morete več urejati',
        CmsFrameNotificationsSaved: 'Shranjeno',
        CmsFrameNotificationsSavedDescription:
          'Vaše spremembe so bile shranjene',
        CmsFrameNotificationsImported: 'Uvoženo',
        CmsFrameNotificationsImportedDescription:
          'Vaše spremembe so bile uvožene',
        CmsFrameNotificationsImportFailed: 'Uvoz ni uspel',
        CmsFrameNotificationsImportFailedDescription:
          'Vaših sprememb ni bilo mogoče uvoziti',
        CmsFrameNotificationsDiscarded: 'Zavrženo',
        CmsFrameNotificationsDiscardedDescription:
          'Vaše spremembe so bile zavržene',

        CmsPagesTitle: 'Jaen CMS | Strani',
        CmsPagesMenuLabel: 'Strani',

        CmsPagesBreadcrumbsPages: 'Strani',
        CmsPagesBreadcrumbsNew: 'Novo',

        CmsPagesNotificationsCreated: 'Stran ustvarjena',
        CmsPagesNotificationsCreatedDescription:
          'Stran {title} je bila ustvarjena',
        CmsPagesNotificationsUpdated: 'Stran posodobljena',
        CmsPagesNotificationsUpdatedDescription:
          'Stran {title} je bila posodobljena',
        CmsPagesNotificationsDeleted: 'Stran izbrisana',
        CmsPagesNotificationsDeletedDescription:
          'Stran {slug} je bila izbrisana',
        CmsPagesNotificationsDuplicated: 'Stran podvojena',
        CmsPagesNotificationsDuplicatedDescription:
          'Stran {slug} je bila podvojena',
        CmsPagesNotificationsMoved: 'Stran premaknjena',
        CmsPagesNotificationsMovedDescription:
          'Stran {slug} je bila premaknjena',
        CmsPagesNotificationsSlugUpdated: 'Slug posodobljen',
        CmsPagesNotificationsSlugUpdatedDescription:
          'Slug je bil posodobljen v {slug}',
        CmsPagesNotificationsDuplicateFailed: 'Strani ni bilo mogoče podvojiti',
        CmsPagesNotificationsMoveFailed: 'Strani ni bilo mogoče premakniti',
        CmsPagesNotificationsSlugUpdateFailed:
          'Sluga ni bilo mogoče posodobiti',

        CmsPagesActionsDuplicate: 'Podvoji stran',
        CmsPagesActionsMove: 'Premakni stran',
        CmsPagesActionsUpdateSlug: 'Posodobi slug',
        CmsPagesActionsRenameSlug: 'Preimenuj slug',
        CmsPagesActionsDelete: 'Izbriši stran',
        CmsPagesActionsDeleteThis: 'Izbriši to stran',

        CmsPagesDescriptionsDuplicate:
          'S tem boste podvojili stran skupaj z njenimi podstranmi.',
        CmsPagesDescriptionsMove:
          'S tem boste premaknili stran in vse njene podstrani.',
        CmsPagesDescriptionsUpdateSlug:
          'S tem boste preimenovali slug, kar vpliva na pot strani in vseh njenih podstrani.',
        CmsPagesDescriptionsDelete:
          'S tem boste izbrisali stran in vse njene podstrani.',

        CmsPagesPromptsDuplicateTitle: 'Podvoji stran',
        CmsPagesPromptsDuplicateMessage:
          'Vnesite nov slug za podvojeno stran. To bo vplivalo na pot.',
        CmsPagesPromptsDuplicateConfirm: 'Podvoji',
        CmsPagesPromptsDuplicateCancel: 'Prekliči',
        CmsPagesPromptsDuplicatePlaceholder: '{slug}-kopija',

        CmsPagesPromptsMoveTitle: 'Premakni stran',
        CmsPagesPromptsMoveMessage: 'Izberite novo nadrejeno stran.',
        CmsPagesPromptsMoveConfirm: 'Premakni',
        CmsPagesPromptsMoveCancel: 'Prekliči',

        CmsPagesPromptsRenameSlugTitle: 'Preimenuj slug',
        CmsPagesPromptsRenameSlugMessage:
          'Vnesite nov slug. To bo vplivalo na pot.',
        CmsPagesPromptsRenameSlugConfirm: 'Preimenuj',
        CmsPagesPromptsRenameSlugCancel: 'Prekliči',

        CmsPagesPromptsDeleteTitle: 'Izbriši stran',
        CmsPagesPromptsDeleteMessage:
          'Ali ste prepričani, da želite izbrisati to stran in vse njene podstrani?',
        CmsPagesPromptsDeleteConfirm: 'Izbriši',

        CmsPagesTableSubpagesHeading: 'Podstrani',
        CmsPagesTableReorderEnable: 'Prerazporedi',
        CmsPagesTableReorderDisable: 'Končano',
        CmsPagesTableNewPage: 'Nova stran',
        CmsPagesTableColumnsTitle: 'Naslov',
        CmsPagesTableColumnsDescription: 'Opis',
        CmsPagesTableColumnsDate: 'Datum',
        CmsPagesTableEmptyStateDescription: 'Ta stran še nima podstrani.',
        CmsPagesTableEmptyStateAction: 'Ustvari novo stran',
        CmsPagesTableDateCreated: 'Ustvarjeno {date} ob {time}',
        CmsPagesTableDateUpdated: 'Nazadnje spremenjeno {date} ob {time}',
        CmsPagesTableDateEmpty: '-',
        CmsPagesTableReorderError:
          'Pri prerazporejanju strani je prišlo do napake.',
        CmsPagesTableDangerZoneHeading: 'Nevarno območje',

        CmsPagesLabelsNoTitle: 'Brez naslova',
        CmsPagesLabelsNoDescription: 'Brez opisa',
        CmsPagesLabelsFallbackTitle: 'Stran',
        CmsPagesLabelsYes: 'Da',

        CmsPagesFormHeadingCreate: 'Ustvari novo stran',
        CmsPagesFormHeadingEdit: 'Uredi stran',
        CmsPagesFormLeadCreate:
          'Stran predstavlja razporeditev polj ali blokov, ki so prikazani na določenem naslovu URL.',
        CmsPagesFormLeadEdit:
          'Uredite stran. Izboljšajte SEO in prisotnost v družbenih omrežjih.',
        CmsPagesFormTemplateCreate: 'Izberite predlogo za novo stran',
        CmsPagesFormTemplateEdit: 'Predloga, uporabljena za stran',
        CmsPagesFormTemplateHelperTextCreate:
          'Ta predloga bo glede na nadrejeno stran uporabljena za novo stran.',
        CmsPagesFormTemplateHelperTextEdit:
          'Če želite spremeniti predlogo, ustvarite novo stran in prenesite vsebino.',
        CmsPagesFormTitleCreate: 'Vnesite naslov nove strani',
        CmsPagesFormTitleEdit: 'Naslov strani',
        CmsPagesFormTitleHelperTextCreate:
          'Naslov nove strani. Slug za URL bo samodejno ustvarjen iz naslova.',
        CmsPagesFormTitleHelperTextEdit: 'Naslov strani.',
        CmsPagesFormDescriptionCreate: 'Vnesite opis nove strani',
        CmsPagesFormDescriptionEdit: 'Opis strani',
        CmsPagesFormDescriptionHelperTextCreate:
          'Opis uporabljajo iskalniki in družbena omrežja. Priporočena dolžina je 160-165 znakov.',
        CmsPagesFormDescriptionHelperTextEdit:
          'Opis uporabljajo iskalniki in družbena omrežja. Priporočena dolžina je 160-165 znakov.',
        CmsPagesFormParentPageCreate: 'Izberite nadrejeno stran',
        CmsPagesFormParentPageEdit: 'Nadrejena stran te strani',
        CmsPagesFormParentHelperTextCreate:
          'To bo nadrejena stran nove strani.',
        CmsPagesFormParentHelperTextEdit:
          'Stran lahko premaknete pod primernejšo nadrejeno stran.',
        CmsPagesFormImageCreate: 'Slika',
        CmsPagesFormImageEdit: 'Slika',
        CmsPagesFormImageHelperTextCreate:
          'Strani dodajte sliko. Če je ne nastavite, bo uporabljena slika nadrejene strani ali spletnega mesta.',
        CmsPagesFormImageHelperTextEdit:
          'Slika strani. Če je ne nastavite, bo uporabljena slika nadrejene strani ali spletnega mesta.',
        CmsPagesFormPostCreate: 'Označi kot prispevek',
        CmsPagesFormPostEdit: 'Prispevek',
        CmsPagesFormPostHelperTextCreate:
          'Označite to stran kot prispevek, da dodate polji za datum in avtorja.',
        CmsPagesFormPostHelperTextEdit:
          'Označite to stran kot prispevek, da dodate polji za datum in avtorja.',
        CmsPagesFormPostDateCreate: 'Vnesite datum nove strani',
        CmsPagesFormPostDateEdit: 'Datum objave strani',
        CmsPagesFormPostDateHelperTextCreate:
          'Datum bo uporabljen za razvrščanje prispevkov.',
        CmsPagesFormPostDateHelperTextEdit:
          'Datum bo uporabljen za razvrščanje prispevkov.',
        CmsPagesFormPostAuthorCreate: 'Vnesite avtorja nove strani',
        CmsPagesFormPostAuthorEdit: 'Avtor strani',
        CmsPagesFormPostAuthorHelperTextCreate:
          'To bo prikazano kot avtor prispevka.',
        CmsPagesFormPostAuthorHelperTextEdit:
          'To bo prikazano kot avtor prispevka.',
        CmsPagesFormPostCategoryCreate: 'Vnesite kategorijo nove strani',
        CmsPagesFormPostCategoryEdit: 'Kategorija strani',
        CmsPagesFormPostCategoryHelperTextCreate:
          'Kategorija bo uporabljena za klasifikacijo prispevkov.',
        CmsPagesFormPostCategoryHelperTextEdit:
          'Kategorija bo uporabljena za klasifikacijo prispevkov.',
        CmsPagesFormExcludeFromIndexCreate: 'Izključi iz kazala',
        CmsPagesFormExcludeFromIndexEdit: 'Izključi iz kazala',
        CmsPagesFormExcludeFromIndexHelperTextCreate:
          'Izključite to stran iz vseh polj kazala (npr. mest, kjer so strani navedene).',
        CmsPagesFormExcludeFromIndexHelperTextEdit:
          'Izključite to stran iz vseh polj kazala (npr. mest, kjer so strani navedene).',
        CmsPagesFormPlaceholdersTitle: 'Naslov',
        CmsPagesFormPlaceholdersSlug: 'slug',
        CmsPagesFormPlaceholdersDescription: 'Opis',
        CmsPagesFormPlaceholdersAuthor: 'Avtor',
        CmsPagesFormPlaceholdersCategory: 'Kategorija',
        CmsPagesFormHelperMediaDescription:
          'Naložite fotografijo, ki predstavlja organizacijo.',
        CmsPagesFormErrorsSlugInUse: 'Slug je že v uporabi',
        CmsPagesFormErrorsParentRequired: 'Nadrejena stran je obvezna',
        CmsPagesFormErrorsTemplateRequired: 'Predloga je obvezna',
        CmsPagesFormErrorsDateRequired: 'Datum je obvezen za prispevke v blogu',
        CmsPagesFormErrorsAuthorRequired:
          'Avtor je obvezen za prispevke v blogu',
        CmsPagesFormButtonsPreview: 'Predogled',
        CmsPagesFormButtonsEdit: 'Uredi stran',
        CmsPagesFormButtonsCancel: 'Prekliči',
        CmsPagesFormButtonsCreate: 'Ustvari stran',
        CmsPagesFormButtonsSave: 'Shrani stran',

        CmsMediaTitle: 'Jaen CMS | Predstavnost',
        CmsMediaMenuLabel: 'Predstavnost',
        CmsMediaBreadcrumbsMedia: 'Predstavnost',

        CmsSettingsTitle: 'Jaen CMS | Nastavitve',
        CmsSettingsMenuLabel: 'Nastavitve',
        CmsSettingsBreadcrumbsSettings: 'Nastavitve',
        CmsSettingsNotificationsUpdated: 'Nastavitve posodobljene',
        CmsSettingsFormHeading: 'Nastavitve',
        CmsSettingsFormSiteInfoGroupTitle: 'Podatki o spletnem mestu',
        CmsSettingsFormSiteInfoTitleLabel: 'Naslov',
        CmsSettingsFormSiteInfoTitlePlaceholder: 'Naslov',
        CmsSettingsFormSiteInfoTitleTooLong: 'Naslov je predolg',
        CmsSettingsFormSiteInfoUrlLabel: 'URL',
        CmsSettingsFormSiteInfoUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormSiteInfoUrlInvalid:
          'URL se mora začeti s http:// ali https://',
        CmsSettingsFormSiteInfoDescriptionLabel: 'Opis',
        CmsSettingsFormSiteInfoDescriptionPlaceholder:
          'Opis, ki se prikaže v iskalnikih in družbenih omrežjih.',
        CmsSettingsFormSiteInfoDescriptionHelper:
          'Kratek opis vašega spletnega mesta.',
        CmsSettingsFormSiteInfoImageLabel: 'Slika',
        CmsSettingsFormSiteInfoImageDescription:
          'Naložite fotografijo, ki predstavlja spletno mesto.',
        CmsSettingsFormOrganisationGroupTitle: 'Organizacija',
        CmsSettingsFormOrganisationNameLabel: 'Ime',
        CmsSettingsFormOrganisationNamePlaceholder: 'Snek',
        CmsSettingsFormOrganisationNameTooLong: 'Ime je predolgo',
        CmsSettingsFormOrganisationUrlLabel: 'URL',
        CmsSettingsFormOrganisationUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormOrganisationUrlInvalid:
          'URL se mora začeti s http:// ali https://',
        CmsSettingsFormOrganisationLogoLabel: 'Slika',
        CmsSettingsFormOrganisationLogoDescription:
          'Naložite fotografijo, ki predstavlja organizacijo.',
        CmsSettingsFormCancel: 'Prekliči',
        CmsSettingsFormSave: 'Shrani',

        CmsDebugTitle: 'Jaen CMS | Razhroščevanje',
        CmsDebugBreadcrumbsDebug: 'Razhroščevanje',

        CmsNotificationTitle: 'Jaen CMS | Obvestilo',
        CmsNotificationMenuLabel: 'Pojavno okno',
        CmsNotificationBreadcrumbsPopup: 'Pojavno okno',
        CmsNotificationCardTitle: 'Pojavno okno z obvestilom',
        CmsNotificationCardDescription:
          'Nastavite pojavno okno z obvestilom. Obvestilo bo prikazano, ko uporabnik obišče stran.',
        CmsNotificationPreview: 'Predogled',
        CmsNotificationNotificationsUpdated: 'Obvestilo posodobljeno',
        CmsNotificationNotificationsUpdatedDescription:
          'Obvestilo je bilo posodobljeno',
        CmsNotificationFormTitleLabel: 'Naslov',
        CmsNotificationFormTitlePlaceholder: 'Novice',
        CmsNotificationFormTitleDescription: 'Naslov obvestila',
        CmsNotificationFormMessageLabel: 'Sporočilo',
        CmsNotificationFormMessageExample: 'To je primer sporočila',
        CmsNotificationFormMessageDescription: 'Sporočilo obvestila',
        CmsNotificationFormEnterUrl: 'Vnesite URL',
        CmsNotificationFormFromLabel: 'Od',
        CmsNotificationFormFromDescription:
          'Obvestilo bo prikazano <b>po</b> tem datumu',
        CmsNotificationFormToLabel: 'Do',
        CmsNotificationFormToDescription:
          'Obvestilo bo prikazano <b>do</b> tega datuma',
        CmsNotificationFormPickDate: 'Izberite datum',
        CmsNotificationFormEnabledLabel:
          'Prikaži pojavno okno z obvestilom, ko uporabnik obišče stran',
        CmsNotificationFormSubmit: 'Pošlji',

        // Accounts
        CmsAccountsErrorsLoadService:
          'Uporabnikov ni bilo mogoče naložiti iz identitetne storitve.',
        CmsAccountsErrorsLoadGeneric: 'Uporabnikov ni bilo mogoče naložiti.',
        CmsAccountsNotificationsCreated: 'Račun ustvarjen',
        CmsAccountsNotificationsCreatedDescription:
          'Račun {username} je bil ustvarjen',
        CmsAccountsNotificationsCreateFailed: 'Računa ni bilo mogoče ustvariti',
        CmsAccountsTitle: 'Računi',
        CmsAccountsPageTitle: 'Jaen CMS | Računi',
        CmsAccountsMenuLabel: 'Računi',
        CmsAccountsBreadcrumbsAccounts: 'Računi',
        CmsAccountsSubtitle:
          'Preglejte in upravljajte uporabniške račune svojega identitetnega najemnika.',
        CmsAccountsActionsCreate: 'Nov račun',
        CmsAccountsSearchPlaceholder:
          'Iskanje po imenu, e-pošti ali prijavnem imenu',
        CmsAccountsErrorsLoadTitle: 'Računov ni mogoče naložiti',
        CmsAccountsCardUnnamed: 'Neimenovan uporabnik',
        CmsAccountsCardNoEmail: 'E-poštni naslov ni naveden',
        CmsAccountsCardUsername: 'Uporabniško ime',
        CmsAccountsCardLoginNames: 'Prijavna imena',
        CmsAccountsCardNoLoginNames: 'Ni dodatnih prijavnih imen',
        CmsAccountsCardManage: 'Upravljaj račun',
        CmsAccountsEmptyTitle: 'Noben račun ne ustreza vašemu iskanju',
        CmsAccountsEmptyHint:
          'Prilagodite iskalni niz ali ustvarite nov račun.',
        CmsAccountsCreateTitle: 'Ustvari nov račun',
        CmsAccountsCreateUsername: 'Uporabniško ime',
        CmsAccountsCreateEmail: 'E-pošta',
        CmsAccountsCreateFirstName: 'Ime',
        CmsAccountsCreateLastName: 'Priimek',
        CmsAccountsCreateInitialPassword: 'Začetno geslo (neobvezno)',
        CmsAccountsCreateSendReset:
          'Če geslo ni nastavljeno, pošlji e-poštno sporočilo za ponastavitev gesla',
        CmsAccountsActionsCancel: 'Prekliči',
        CmsAccountsActionsCreateSubmit: 'Ustvari račun',
        CmsAccountsErrorsDetailService:
          'Uporabniškega profila ni bilo mogoče naložiti iz identitetne storitve.',
        CmsAccountsErrorsDetailGeneric:
          'Uporabniškega profila ni bilo mogoče naložiti.',
        CmsAccountsNotificationsActionFailed: 'Dejanje ni uspelo',
        CmsAccountsNotificationsSaved: 'Spremembe shranjene',
        CmsAccountsNotificationsSavedDescription: 'Profil je bil posodobljen.',
        CmsAccountsNotificationsSaveFailed: 'Shranjevanje ni uspelo',
        CmsAccountsNotificationsDeleted: 'Račun izbrisan',
        CmsAccountsNotificationsPasswordSet: 'Geslo nastavljeno',
        CmsAccountsNotificationsRolesUpdated: 'Vloge posodobljene',
        CmsAccountsDetailBack: 'Nazaj na račune',
        CmsAccountsErrorsDetailTitle: 'Tega računa ni mogoče naložiti',
        CmsAccountsDetailNoEmail: 'Primarni e-poštni naslov ni naveden',
        CmsAccountsDetailUsername: 'Uporabniško ime',
        CmsAccountsDetailPreferredLogin: 'Prednostna prijava',
        CmsAccountsDetailState: 'Stanje računa',
        CmsAccountsDetailCreated: 'Ustvarjeno',
        CmsAccountsDetailLastChange: 'Zadnja sprememba',
        CmsAccountsDetailResourceOwner: 'Organizacija',
        CmsAccountsProfileTitle: 'Profil',
        CmsAccountsProfileDisplayName: 'Prikazno ime',
        CmsAccountsProfileLanguage: 'Prednostni jezik',
        CmsAccountsProfileFirstName: 'Ime',
        CmsAccountsProfileLastName: 'Priimek',
        CmsAccountsProfileEmail: 'E-pošta',
        CmsAccountsProfilePhone: 'Telefon',
        CmsAccountsProfileReset: 'Ponastavi',
        CmsAccountsProfileSave: 'Shrani spremembe',
        CmsAccountsRolesTitle: 'Projektne vloge',
        CmsAccountsRolesGrant: 'Dodeli vloge',
        CmsAccountsRolesEdit: 'Uredi',
        CmsAccountsNotificationsRolesRevoked: 'Vloge odvzete',
        CmsAccountsRolesRevoke: 'Odvzemi',
        CmsAccountsRolesEmpty: 'Ni dodeljenih projektnih vlog.',
        CmsAccountsActionsTitle: 'Dejanja računa',
        CmsAccountsActionsSetPassword: 'Nastavi geslo',
        CmsAccountsNotificationsResetRequested: 'Ponastavitev gesla zahtevana',
        CmsAccountsActionsRequestReset: 'Zahtevaj ponastavitev gesla',
        CmsAccountsNotificationsVerificationSent:
          'Potrditveno e-poštno sporočilo poslano',
        CmsAccountsActionsResendVerification:
          'Znova pošlji potrditveno e-poštno sporočilo',
        CmsAccountsNotificationsDeactivated: 'Račun deaktiviran',
        CmsAccountsActionsDeactivate: 'Deaktiviraj',
        CmsAccountsNotificationsReactivated: 'Račun znova aktiviran',
        CmsAccountsActionsReactivate: 'Znova aktiviraj',
        CmsAccountsNotificationsUnlocked: 'Račun odklenjen',
        CmsAccountsActionsUnlock: 'Odkleni',
        CmsAccountsNotificationsLocked: 'Račun zaklenjen',
        CmsAccountsActionsLock: 'Zakleni',
        CmsAccountsActionsDelete: 'Izbriši račun',
        CmsAccountsDeleteTitle: 'Izbriši račun',
        CmsAccountsDeletePrompt:
          'Ali ste prepričani, da želite izbrisati {username}? Tega dejanja ni mogoče razveljaviti.',
        CmsAccountsPasswordTitle: 'Nastavi novo geslo',
        CmsAccountsPasswordNew: 'Novo geslo',
        CmsAccountsPasswordChangeRequired:
          'Zahtevaj spremembo ob naslednji prijavi',
        CmsAccountsRolesEditTitle: 'Uredi dodeljene vloge',
        CmsAccountsRolesGrantTitle: 'Dodeli projektne vloge',
        CmsAccountsRolesProject: 'Projekt',
        CmsAccountsRolesNoneAvailable: 'Za ta projekt ni vlog na voljo.',
        CmsAccountsRolesSave: 'Shrani vloge'
      }
    }
  }

  if (code === 'it-IT') {
    return {
      code,
      strings: {
        Language: 'Italiano',

        AuthLogin: 'Accedi',
        AuthSignup: 'Registrati',
        AuthLogout: 'Esci',
        AuthSettings: 'Impostazioni',

        CmsLabelsRoot: 'CMS',

        CmsDashboardTitle: 'Jaen CMS',
        CmsDashboardMenuLabel: 'Dashboard',
        CmsDashboardMenuGroupLabel: 'Jaen CMS',

        CmsFrameStartEditing: 'Inizia la modifica',
        CmsFrameStopEditing: 'Termina la modifica',
        CmsFrameSaveDraft: 'Salva bozza',
        CmsFrameImportDraft: 'Importa bozza',
        CmsFrameDiscardChanges: 'Scarta le modifiche',
        CmsFramePublish:
          '{isPublishing, select, true {Pubblicazione in corso} other {Pubblica le modifiche}}',
        CmsFrameNewMedia: 'Nuovo media',
        CmsFrameGuest: 'Ospite',
        CmsFrameNotificationsEditModeTitle: 'Modalità di modifica',
        CmsFrameNotificationsEditModeOn: 'Ora puoi modificare la pagina',
        CmsFrameNotificationsEditModeOff: 'Non puoi più modificare la pagina',
        CmsFrameNotificationsSaved: 'Salvato',
        CmsFrameNotificationsSavedDescription:
          'Le tue modifiche sono state salvate',
        CmsFrameNotificationsImported: 'Importato',
        CmsFrameNotificationsImportedDescription:
          'Le tue modifiche sono state importate',
        CmsFrameNotificationsImportFailed: 'Importazione non riuscita',
        CmsFrameNotificationsImportFailedDescription:
          'Non è stato possibile importare le tue modifiche',
        CmsFrameNotificationsDiscarded: 'Scartato',
        CmsFrameNotificationsDiscardedDescription:
          'Le tue modifiche sono state scartate',

        CmsPagesTitle: 'Jaen CMS | Pagine',
        CmsPagesMenuLabel: 'Pagine',

        CmsPagesBreadcrumbsPages: 'Pagine',
        CmsPagesBreadcrumbsNew: 'Nuova',

        CmsPagesNotificationsCreated: 'Pagina creata',
        CmsPagesNotificationsCreatedDescription:
          'La pagina {title} è stata creata',
        CmsPagesNotificationsUpdated: 'Pagina aggiornata',
        CmsPagesNotificationsUpdatedDescription:
          'La pagina {title} è stata aggiornata',
        CmsPagesNotificationsDeleted: 'Pagina eliminata',
        CmsPagesNotificationsDeletedDescription:
          'La pagina {slug} è stata eliminata',
        CmsPagesNotificationsDuplicated: 'Pagina duplicata',
        CmsPagesNotificationsDuplicatedDescription:
          'La pagina {slug} è stata duplicata',
        CmsPagesNotificationsMoved: 'Pagina spostata',
        CmsPagesNotificationsMovedDescription:
          'La pagina {slug} è stata spostata',
        CmsPagesNotificationsSlugUpdated: 'Slug aggiornato',
        CmsPagesNotificationsSlugUpdatedDescription:
          'Lo slug è stato aggiornato in {slug}',
        CmsPagesNotificationsDuplicateFailed: 'Impossibile duplicare la pagina',
        CmsPagesNotificationsMoveFailed: 'Impossibile spostare la pagina',
        CmsPagesNotificationsSlugUpdateFailed: 'Impossibile aggiornare lo slug',

        CmsPagesActionsDuplicate: 'Duplica pagina',
        CmsPagesActionsMove: 'Sposta pagina',
        CmsPagesActionsUpdateSlug: 'Aggiorna slug',
        CmsPagesActionsRenameSlug: 'Rinomina slug',
        CmsPagesActionsDelete: 'Elimina pagina',
        CmsPagesActionsDeleteThis: 'Elimina questa pagina',

        CmsPagesDescriptionsDuplicate:
          'Questa operazione duplicherà la pagina con le sue sottopagine.',
        CmsPagesDescriptionsMove:
          'Questa operazione sposterà la pagina e tutte le sue sottopagine.',
        CmsPagesDescriptionsUpdateSlug:
          'Questa operazione rinominerà lo slug e influirà quindi sul percorso della pagina e di tutte le sue sottopagine.',
        CmsPagesDescriptionsDelete:
          'Questa operazione eliminerà la pagina e tutte le sue sottopagine.',

        CmsPagesPromptsDuplicateTitle: 'Duplica pagina',
        CmsPagesPromptsDuplicateMessage:
          'Inserisci un nuovo slug per la pagina duplicata. Questo influirà sul percorso.',
        CmsPagesPromptsDuplicateConfirm: 'Duplica',
        CmsPagesPromptsDuplicateCancel: 'Annulla',
        CmsPagesPromptsDuplicatePlaceholder: '{slug}-copia',

        CmsPagesPromptsMoveTitle: 'Sposta pagina',
        CmsPagesPromptsMoveMessage: 'Seleziona una nuova pagina genitore.',
        CmsPagesPromptsMoveConfirm: 'Sposta',
        CmsPagesPromptsMoveCancel: 'Annulla',

        CmsPagesPromptsRenameSlugTitle: 'Rinomina slug',
        CmsPagesPromptsRenameSlugMessage:
          'Inserisci un nuovo slug. Questo influirà sul percorso.',
        CmsPagesPromptsRenameSlugConfirm: 'Rinomina',
        CmsPagesPromptsRenameSlugCancel: 'Annulla',

        CmsPagesPromptsDeleteTitle: 'Elimina pagina',
        CmsPagesPromptsDeleteMessage:
          'Sei sicuro di voler eliminare questa pagina e tutte le sue sottopagine?',
        CmsPagesPromptsDeleteConfirm: 'Elimina',

        CmsPagesTableSubpagesHeading: 'Sottopagine',
        CmsPagesTableReorderEnable: 'Riordina',
        CmsPagesTableReorderDisable: 'Fatto',
        CmsPagesTableNewPage: 'Nuova pagina',
        CmsPagesTableColumnsTitle: 'Titolo',
        CmsPagesTableColumnsDescription: 'Descrizione',
        CmsPagesTableColumnsDate: 'Data',
        CmsPagesTableEmptyStateDescription:
          'Questa pagina non ha ancora sottopagine.',
        CmsPagesTableEmptyStateAction: 'Crea una nuova pagina',
        CmsPagesTableDateCreated: 'Creata il {date} alle {time}',
        CmsPagesTableDateUpdated: 'Ultima modifica il {date} alle {time}',
        CmsPagesTableDateEmpty: '-',
        CmsPagesTableReorderError:
          'Si è verificato un errore durante il riordino delle pagine.',
        CmsPagesTableDangerZoneHeading: 'Zona di pericolo',

        CmsPagesLabelsNoTitle: 'Nessun titolo',
        CmsPagesLabelsNoDescription: 'Nessuna descrizione',
        CmsPagesLabelsFallbackTitle: 'Pagina',
        CmsPagesLabelsYes: 'Sì',

        CmsPagesFormHeadingCreate: 'Crea una nuova pagina',
        CmsPagesFormHeadingEdit: 'Modifica la pagina',
        CmsPagesFormLeadCreate:
          'Una pagina rappresenta una disposizione di campi o blocchi visualizzati a un URL specifico.',
        CmsPagesFormLeadEdit:
          'Modifica la pagina. Migliora la SEO e la presenza sui social media.',
        CmsPagesFormTemplateCreate: 'Seleziona un template per la nuova pagina',
        CmsPagesFormTemplateEdit: 'Il template utilizzato per la pagina',
        CmsPagesFormTemplateHelperTextCreate:
          'Questo template verrà applicato alla nuova pagina, in base alla pagina genitore.',
        CmsPagesFormTemplateHelperTextEdit:
          'Se desideri modificare il template, crea una nuova pagina e trasferisci il contenuto.',
        CmsPagesFormTitleCreate: 'Inserisci un titolo per la nuova pagina',
        CmsPagesFormTitleEdit: 'Il titolo della pagina',
        CmsPagesFormTitleHelperTextCreate:
          "Il titolo della nuova pagina. Lo slug dell'URL verrà generato automaticamente dal titolo.",
        CmsPagesFormTitleHelperTextEdit: 'Il titolo della pagina.',
        CmsPagesFormDescriptionCreate:
          'Fornisci una descrizione per la nuova pagina',
        CmsPagesFormDescriptionEdit: 'La descrizione della pagina',
        CmsPagesFormDescriptionHelperTextCreate:
          "La descrizione verrà utilizzata dai motori di ricerca e dai social media. L'ideale è una lunghezza di 160-165 caratteri.",
        CmsPagesFormDescriptionHelperTextEdit:
          "La descrizione verrà utilizzata dai motori di ricerca e dai social media. L'ideale è una lunghezza di 160-165 caratteri.",
        CmsPagesFormParentPageCreate: 'Seleziona una pagina genitore',
        CmsPagesFormParentPageEdit: 'La pagina genitore della pagina',
        CmsPagesFormParentHelperTextCreate:
          'Questa fungerà da pagina genitore della nuova pagina.',
        CmsPagesFormParentHelperTextEdit:
          'Puoi spostare la pagina sotto una pagina genitore più adatta.',
        CmsPagesFormImageCreate: 'Immagine',
        CmsPagesFormImageEdit: 'Immagine',
        CmsPagesFormImageHelperTextCreate:
          "Aggiungi un'immagine alla pagina. Se non impostata, verrà utilizzata l'immagine della pagina genitore o del sito.",
        CmsPagesFormImageHelperTextEdit:
          "L'immagine della pagina. Se non impostata, verrà utilizzata l'immagine della pagina genitore o del sito.",
        CmsPagesFormPostCreate: 'Contrassegna come articolo',
        CmsPagesFormPostEdit: 'Articolo',
        CmsPagesFormPostHelperTextCreate:
          'Contrassegna questa pagina come articolo per aggiungere i campi data e autore.',
        CmsPagesFormPostHelperTextEdit:
          'Contrassegna questa pagina come articolo per aggiungere i campi data e autore.',
        CmsPagesFormPostDateCreate: 'Inserisci una data per la nuova pagina',
        CmsPagesFormPostDateEdit: 'La data di pubblicazione della pagina',
        CmsPagesFormPostDateHelperTextCreate:
          "La data verrà utilizzata per l'ordinamento degli articoli.",
        CmsPagesFormPostDateHelperTextEdit:
          "La data verrà utilizzata per l'ordinamento degli articoli.",
        CmsPagesFormPostAuthorCreate: 'Inserisci un autore per la nuova pagina',
        CmsPagesFormPostAuthorEdit: "L'autore della pagina",
        CmsPagesFormPostAuthorHelperTextCreate:
          "Verrà visualizzato come autore dell'articolo.",
        CmsPagesFormPostAuthorHelperTextEdit:
          "Verrà visualizzato come autore dell'articolo.",
        CmsPagesFormPostCategoryCreate:
          'Inserisci una categoria per la nuova pagina',
        CmsPagesFormPostCategoryEdit: 'La categoria della pagina',
        CmsPagesFormPostCategoryHelperTextCreate:
          'La categoria verrà utilizzata per la classificazione degli articoli.',
        CmsPagesFormPostCategoryHelperTextEdit:
          'La categoria verrà utilizzata per la classificazione degli articoli.',
        CmsPagesFormExcludeFromIndexCreate: "Escludi dall'indice",
        CmsPagesFormExcludeFromIndexEdit: "Escludi dall'indice",
        CmsPagesFormExcludeFromIndexHelperTextCreate:
          'Escludi questa pagina da tutti i campi indice (ad es. i punti in cui vengono elencate le pagine).',
        CmsPagesFormExcludeFromIndexHelperTextEdit:
          'Escludi questa pagina da tutti i campi indice (ad es. i punti in cui vengono elencate le pagine).',
        CmsPagesFormPlaceholdersTitle: 'Titolo',
        CmsPagesFormPlaceholdersSlug: 'slug',
        CmsPagesFormPlaceholdersDescription: 'Descrizione',
        CmsPagesFormPlaceholdersAuthor: 'Autore',
        CmsPagesFormPlaceholdersCategory: 'Categoria',
        CmsPagesFormHelperMediaDescription:
          "Carica una foto che rappresenti l'organizzazione.",
        CmsPagesFormErrorsSlugInUse: 'Lo slug è già in uso',
        CmsPagesFormErrorsParentRequired: 'La pagina genitore è obbligatoria',
        CmsPagesFormErrorsTemplateRequired: 'Il template è obbligatorio',
        CmsPagesFormErrorsDateRequired:
          'La data è obbligatoria per gli articoli del blog',
        CmsPagesFormErrorsAuthorRequired:
          "L'autore è obbligatorio per gli articoli del blog",
        CmsPagesFormButtonsPreview: 'Anteprima',
        CmsPagesFormButtonsEdit: 'Modifica pagina',
        CmsPagesFormButtonsCancel: 'Annulla',
        CmsPagesFormButtonsCreate: 'Crea pagina',
        CmsPagesFormButtonsSave: 'Salva pagina',

        CmsMediaTitle: 'Jaen CMS | Media',
        CmsMediaMenuLabel: 'Media',
        CmsMediaBreadcrumbsMedia: 'Media',

        CmsSettingsTitle: 'Jaen CMS | Impostazioni',
        CmsSettingsMenuLabel: 'Impostazioni',
        CmsSettingsBreadcrumbsSettings: 'Impostazioni',
        CmsSettingsNotificationsUpdated: 'Impostazioni aggiornate',
        CmsSettingsFormHeading: 'Impostazioni',
        CmsSettingsFormSiteInfoGroupTitle: 'Informazioni sul sito',
        CmsSettingsFormSiteInfoTitleLabel: 'Titolo',
        CmsSettingsFormSiteInfoTitlePlaceholder: 'Titolo',
        CmsSettingsFormSiteInfoTitleTooLong: 'Il titolo è troppo lungo',
        CmsSettingsFormSiteInfoUrlLabel: 'URL',
        CmsSettingsFormSiteInfoUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormSiteInfoUrlInvalid:
          "L'URL deve iniziare con http:// o https://",
        CmsSettingsFormSiteInfoDescriptionLabel: 'Descrizione',
        CmsSettingsFormSiteInfoDescriptionPlaceholder:
          'La descrizione che appare nei motori di ricerca e sui social media.',
        CmsSettingsFormSiteInfoDescriptionHelper: 'Breve descrizione del sito.',
        CmsSettingsFormSiteInfoImageLabel: 'Immagine',
        CmsSettingsFormSiteInfoImageDescription:
          'Carica una foto che rappresenti il sito.',
        CmsSettingsFormOrganisationGroupTitle: 'Organizzazione',
        CmsSettingsFormOrganisationNameLabel: 'Nome',
        CmsSettingsFormOrganisationNamePlaceholder: 'Snek',
        CmsSettingsFormOrganisationNameTooLong: 'Il nome è troppo lungo',
        CmsSettingsFormOrganisationUrlLabel: 'URL',
        CmsSettingsFormOrganisationUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormOrganisationUrlInvalid:
          "L'URL deve iniziare con http:// o https://",
        CmsSettingsFormOrganisationLogoLabel: 'Immagine',
        CmsSettingsFormOrganisationLogoDescription:
          "Carica una foto che rappresenti l'organizzazione.",
        CmsSettingsFormCancel: 'Annulla',
        CmsSettingsFormSave: 'Salva',

        CmsDebugTitle: 'Jaen CMS | Debug',
        CmsDebugBreadcrumbsDebug: 'Debug',

        CmsNotificationTitle: 'Jaen CMS | Notifica',
        CmsNotificationMenuLabel: 'Popup',
        CmsNotificationBreadcrumbsPopup: 'Popup',
        CmsNotificationCardTitle: 'Popup di notifica',
        CmsNotificationCardDescription:
          'Configura il popup di notifica. La notifica verrà mostrata quando l\'utente visita la pagina.',
        CmsNotificationPreview: 'Anteprima',
        CmsNotificationNotificationsUpdated: 'Notifica aggiornata',
        CmsNotificationNotificationsUpdatedDescription:
          'La notifica è stata aggiornata',
        CmsNotificationFormTitleLabel: 'Titolo',
        CmsNotificationFormTitlePlaceholder: 'Novità',
        CmsNotificationFormTitleDescription: 'Il titolo della notifica',
        CmsNotificationFormMessageLabel: 'Messaggio',
        CmsNotificationFormMessageExample: 'Questo è un messaggio di esempio',
        CmsNotificationFormMessageDescription: 'Il messaggio della notifica',
        CmsNotificationFormEnterUrl: 'Inserisci l\'URL',
        CmsNotificationFormFromLabel: 'Da',
        CmsNotificationFormFromDescription:
          'La notifica verrà mostrata <b>dopo</b> questa data',
        CmsNotificationFormToLabel: 'A',
        CmsNotificationFormToDescription:
          'La notifica verrà mostrata <b>fino a</b> questa data',
        CmsNotificationFormPickDate: 'Scegli una data',
        CmsNotificationFormEnabledLabel:
          'Mostra il popup di notifica quando l\'utente visita la pagina',
        CmsNotificationFormSubmit: 'Invia',

        // Accounts
        CmsAccountsErrorsLoadService:
          'Impossibile caricare gli utenti dal servizio di identità.',
        CmsAccountsErrorsLoadGeneric: 'Impossibile caricare gli utenti.',
        CmsAccountsNotificationsCreated: 'Account creato',
        CmsAccountsNotificationsCreatedDescription:
          "L'account {username} è stato creato",
        CmsAccountsNotificationsCreateFailed: "Impossibile creare l'account",
        CmsAccountsTitle: 'Account',
        CmsAccountsPageTitle: 'Jaen CMS | Account',
        CmsAccountsMenuLabel: 'Account',
        CmsAccountsBreadcrumbsAccounts: 'Account',
        CmsAccountsSubtitle:
          'Sfoglia e gestisci gli account utente del tuo tenant di identità.',
        CmsAccountsActionsCreate: 'Nuovo account',
        CmsAccountsSearchPlaceholder: 'Cerca per nome, email o nome di accesso',
        CmsAccountsErrorsLoadTitle: 'Impossibile caricare gli account',
        CmsAccountsCardUnnamed: 'Utente senza nome',
        CmsAccountsCardNoEmail: 'Nessuna email specificata',
        CmsAccountsCardUsername: 'Nome utente',
        CmsAccountsCardLoginNames: 'Nomi di accesso',
        CmsAccountsCardNoLoginNames: 'Nessun nome di accesso alternativo',
        CmsAccountsCardManage: 'Gestisci account',
        CmsAccountsEmptyTitle: 'Nessun account corrisponde alla ricerca',
        CmsAccountsEmptyHint:
          'Modifica il termine di ricerca o crea un nuovo account.',
        CmsAccountsCreateTitle: 'Crea un nuovo account',
        CmsAccountsCreateUsername: 'Nome utente',
        CmsAccountsCreateEmail: 'Email',
        CmsAccountsCreateFirstName: 'Nome',
        CmsAccountsCreateLastName: 'Cognome',
        CmsAccountsCreateInitialPassword: 'Password iniziale (facoltativa)',
        CmsAccountsCreateSendReset:
          "Invia un'email di reimpostazione della password se non viene impostata alcuna password",
        CmsAccountsActionsCancel: 'Annulla',
        CmsAccountsActionsCreateSubmit: 'Crea account',
        CmsAccountsErrorsDetailService:
          'Impossibile caricare il profilo utente dal servizio di identità.',
        CmsAccountsErrorsDetailGeneric:
          'Impossibile caricare il profilo utente.',
        CmsAccountsNotificationsActionFailed: 'Operazione non riuscita',
        CmsAccountsNotificationsSaved: 'Modifiche salvate',
        CmsAccountsNotificationsSavedDescription:
          'Il profilo è stato aggiornato.',
        CmsAccountsNotificationsSaveFailed: 'Salvataggio non riuscito',
        CmsAccountsNotificationsDeleted: 'Account eliminato',
        CmsAccountsNotificationsPasswordSet: 'Password impostata',
        CmsAccountsNotificationsRolesUpdated: 'Ruoli aggiornati',
        CmsAccountsDetailBack: 'Torna agli account',
        CmsAccountsErrorsDetailTitle: 'Impossibile caricare questo account',
        CmsAccountsDetailNoEmail: 'Nessuna email principale specificata',
        CmsAccountsDetailUsername: 'Nome utente',
        CmsAccountsDetailPreferredLogin: 'Nome di accesso preferito',
        CmsAccountsDetailState: "Stato dell'account",
        CmsAccountsDetailCreated: 'Creato',
        CmsAccountsDetailLastChange: 'Ultima modifica',
        CmsAccountsDetailResourceOwner: 'Organizzazione',
        CmsAccountsProfileTitle: 'Profilo',
        CmsAccountsProfileDisplayName: 'Nome visualizzato',
        CmsAccountsProfileLanguage: 'Lingua preferita',
        CmsAccountsProfileFirstName: 'Nome',
        CmsAccountsProfileLastName: 'Cognome',
        CmsAccountsProfileEmail: 'Email',
        CmsAccountsProfilePhone: 'Telefono',
        CmsAccountsProfileReset: 'Ripristina',
        CmsAccountsProfileSave: 'Salva modifiche',
        CmsAccountsRolesTitle: 'Ruoli di progetto',
        CmsAccountsRolesGrant: 'Assegna ruoli',
        CmsAccountsRolesEdit: 'Modifica',
        CmsAccountsNotificationsRolesRevoked: 'Ruoli revocati',
        CmsAccountsRolesRevoke: 'Revoca',
        CmsAccountsRolesEmpty: 'Nessun ruolo di progetto assegnato.',
        CmsAccountsActionsTitle: "Azioni sull'account",
        CmsAccountsActionsSetPassword: 'Imposta password',
        CmsAccountsNotificationsResetRequested:
          'Reimpostazione della password richiesta',
        CmsAccountsActionsRequestReset: 'Richiedi reimpostazione password',
        CmsAccountsNotificationsVerificationSent: 'Email di verifica inviata',
        CmsAccountsActionsResendVerification:
          "Invia di nuovo l'email di verifica",
        CmsAccountsNotificationsDeactivated: 'Account disattivato',
        CmsAccountsActionsDeactivate: 'Disattiva',
        CmsAccountsNotificationsReactivated: 'Account riattivato',
        CmsAccountsActionsReactivate: 'Riattiva',
        CmsAccountsNotificationsUnlocked: 'Account sbloccato',
        CmsAccountsActionsUnlock: 'Sblocca',
        CmsAccountsNotificationsLocked: 'Account bloccato',
        CmsAccountsActionsLock: 'Blocca',
        CmsAccountsActionsDelete: 'Elimina account',
        CmsAccountsDeleteTitle: 'Elimina account',
        CmsAccountsDeletePrompt:
          'Sei sicuro di voler eliminare {username}? Questa operazione non può essere annullata.',
        CmsAccountsPasswordTitle: 'Imposta una nuova password',
        CmsAccountsPasswordNew: 'Nuova password',
        CmsAccountsPasswordChangeRequired:
          'Richiedi la modifica al prossimo accesso',
        CmsAccountsRolesEditTitle: 'Modifica i ruoli assegnati',
        CmsAccountsRolesGrantTitle: 'Assegna ruoli di progetto',
        CmsAccountsRolesProject: 'Progetto',
        CmsAccountsRolesNoneAvailable:
          'Nessun ruolo disponibile per questo progetto.',
        CmsAccountsRolesSave: 'Salva ruoli'
      }
    }
  }

  if (code === 'ja-JP') {
    return {
      code,
      strings: {
        Language: '日本語',

        AuthLogin: 'ログイン',
        AuthSignup: '新規登録',
        AuthLogout: 'ログアウト',
        AuthSettings: '設定',

        CmsLabelsRoot: 'CMS',

        CmsDashboardTitle: 'Jaen CMS',
        CmsDashboardMenuLabel: 'ダッシュボード',
        CmsDashboardMenuGroupLabel: 'Jaen CMS',

        CmsFrameStartEditing: '編集を開始',
        CmsFrameStopEditing: '編集を終了',
        CmsFrameSaveDraft: '下書きを保存',
        CmsFrameImportDraft: '下書きをインポート',
        CmsFrameDiscardChanges: '変更を破棄',
        CmsFramePublish: '{isPublishing, select, true {公開処理中} other {変更を公開}}',
        CmsFrameNewMedia: '新規メディア',
        CmsFrameGuest: 'ゲスト',
        CmsFrameNotificationsEditModeTitle: '編集モード',
        CmsFrameNotificationsEditModeOn: 'ページを編集できるようになりました',
        CmsFrameNotificationsEditModeOff: 'ページを編集できなくなりました',
        CmsFrameNotificationsSaved: '保存しました',
        CmsFrameNotificationsSavedDescription: '変更を保存しました',
        CmsFrameNotificationsImported: 'インポートしました',
        CmsFrameNotificationsImportedDescription: '変更をインポートしました',
        CmsFrameNotificationsImportFailed: 'インポートに失敗しました',
        CmsFrameNotificationsImportFailedDescription: '変更をインポートできませんでした',
        CmsFrameNotificationsDiscarded: '破棄しました',
        CmsFrameNotificationsDiscardedDescription: '変更を破棄しました',

        CmsPagesTitle: 'Jaen CMS | ページ',
        CmsPagesMenuLabel: 'ページ',

        CmsPagesBreadcrumbsPages: 'ページ',
        CmsPagesBreadcrumbsNew: '新規',

        CmsPagesNotificationsCreated: 'ページを作成しました',
        CmsPagesNotificationsCreatedDescription:
          'ページ「{title}」を作成しました',
        CmsPagesNotificationsUpdated: 'ページを更新しました',
        CmsPagesNotificationsUpdatedDescription:
          'ページ「{title}」を更新しました',
        CmsPagesNotificationsDeleted: 'ページを削除しました',
        CmsPagesNotificationsDeletedDescription:
          'ページ「{slug}」を削除しました',
        CmsPagesNotificationsDuplicated: 'ページを複製しました',
        CmsPagesNotificationsDuplicatedDescription:
          'ページ「{slug}」を複製しました',
        CmsPagesNotificationsMoved: 'ページを移動しました',
        CmsPagesNotificationsMovedDescription: 'ページ「{slug}」を移動しました',
        CmsPagesNotificationsSlugUpdated: 'スラッグを更新しました',
        CmsPagesNotificationsSlugUpdatedDescription:
          'スラッグを {slug} に更新しました',
        CmsPagesNotificationsDuplicateFailed: 'ページを複製できませんでした',
        CmsPagesNotificationsMoveFailed: 'ページを移動できませんでした',
        CmsPagesNotificationsSlugUpdateFailed: 'スラッグを更新できませんでした',

        CmsPagesActionsDuplicate: 'ページを複製',
        CmsPagesActionsMove: 'ページを移動',
        CmsPagesActionsUpdateSlug: 'スラッグを更新',
        CmsPagesActionsRenameSlug: 'スラッグを変更',
        CmsPagesActionsDelete: 'ページを削除',
        CmsPagesActionsDeleteThis: 'このページを削除',

        CmsPagesDescriptionsDuplicate:
          'この操作により、ページとそのサブページが複製されます。',
        CmsPagesDescriptionsMove:
          'この操作により、ページとすべてのサブページが移動されます。',
        CmsPagesDescriptionsUpdateSlug:
          'この操作によりスラッグが変更され、このページとすべてのサブページのパスに影響します。',
        CmsPagesDescriptionsDelete:
          'この操作により、ページとすべてのサブページが削除されます。',

        CmsPagesPromptsDuplicateTitle: 'ページを複製',
        CmsPagesPromptsDuplicateMessage:
          '複製するページの新しいスラッグを入力してください。パスに影響します。',
        CmsPagesPromptsDuplicateConfirm: '複製',
        CmsPagesPromptsDuplicateCancel: 'キャンセル',
        CmsPagesPromptsDuplicatePlaceholder: '{slug}-copy',

        CmsPagesPromptsMoveTitle: 'ページを移動',
        CmsPagesPromptsMoveMessage: '新しい親ページを選択してください。',
        CmsPagesPromptsMoveConfirm: '移動',
        CmsPagesPromptsMoveCancel: 'キャンセル',

        CmsPagesPromptsRenameSlugTitle: 'スラッグを変更',
        CmsPagesPromptsRenameSlugMessage:
          '新しいスラッグを入力してください。パスに影響します。',
        CmsPagesPromptsRenameSlugConfirm: '変更',
        CmsPagesPromptsRenameSlugCancel: 'キャンセル',

        CmsPagesPromptsDeleteTitle: 'ページを削除',
        CmsPagesPromptsDeleteMessage:
          'このページとすべてのサブページを削除してもよろしいですか？',
        CmsPagesPromptsDeleteConfirm: '削除',

        CmsPagesTableSubpagesHeading: 'サブページ',
        CmsPagesTableReorderEnable: '並べ替え',
        CmsPagesTableReorderDisable: '完了',
        CmsPagesTableNewPage: '新規ページ',
        CmsPagesTableColumnsTitle: 'タイトル',
        CmsPagesTableColumnsDescription: '説明',
        CmsPagesTableColumnsDate: '日付',
        CmsPagesTableEmptyStateDescription:
          'このページにはまだサブページがありません。',
        CmsPagesTableEmptyStateAction: '新しいページを作成',
        CmsPagesTableDateCreated: '作成日時: {date} {time}',
        CmsPagesTableDateUpdated: '最終更新日時: {date} {time}',
        CmsPagesTableDateEmpty: '-',
        CmsPagesTableReorderError: 'ページの並べ替え中に問題が発生しました。',
        CmsPagesTableDangerZoneHeading: '危険な操作',

        CmsPagesLabelsNoTitle: 'タイトルなし',
        CmsPagesLabelsNoDescription: '説明なし',
        CmsPagesLabelsFallbackTitle: 'ページ',
        CmsPagesLabelsYes: 'はい',

        CmsPagesFormHeadingCreate: '新規ページの作成',
        CmsPagesFormHeadingEdit: 'ページの編集',
        CmsPagesFormLeadCreate:
          'ページとは、特定の URL に表示されるフィールドやブロックの構成を指します。',
        CmsPagesFormLeadEdit:
          'ページを編集します。SEO と SNS でのプレゼンスを高めましょう。',
        CmsPagesFormTemplateCreate: '新規ページのテンプレートを選択',
        CmsPagesFormTemplateEdit: 'このページに使用されているテンプレート',
        CmsPagesFormTemplateHelperTextCreate:
          'このテンプレートは、親ページに基づいて新規ページに適用されます。',
        CmsPagesFormTemplateHelperTextEdit:
          'テンプレートを変更する場合は、新しいページを作成してコンテンツを移行してください。',
        CmsPagesFormTitleCreate: '新規ページのタイトルを入力',
        CmsPagesFormTitleEdit: 'ページのタイトル',
        CmsPagesFormTitleHelperTextCreate:
          '新規ページのタイトルです。URL スラッグはタイトルから自動的に生成されます。',
        CmsPagesFormTitleHelperTextEdit: 'ページのタイトルです。',
        CmsPagesFormDescriptionCreate: '新規ページの説明を入力',
        CmsPagesFormDescriptionEdit: 'ページの説明',
        CmsPagesFormDescriptionHelperTextCreate:
          '説明は検索エンジンや SNS で使用されます。160〜165 文字を目安にしてください。',
        CmsPagesFormDescriptionHelperTextEdit:
          '説明は検索エンジンや SNS で使用されます。160〜165 文字を目安にしてください。',
        CmsPagesFormParentPageCreate: '親ページを選択',
        CmsPagesFormParentPageEdit: 'このページの親ページ',
        CmsPagesFormParentHelperTextCreate: '新規ページの親ページとなります。',
        CmsPagesFormParentHelperTextEdit:
          'より適切な親ページにページを移動することもできます。',
        CmsPagesFormImageCreate: '画像',
        CmsPagesFormImageEdit: '画像',
        CmsPagesFormImageHelperTextCreate:
          'ページに画像を設定します。未設定の場合は、親ページまたはサイトの画像が使用されます。',
        CmsPagesFormImageHelperTextEdit:
          'ページの画像です。未設定の場合は、親ページまたはサイトの画像が使用されます。',
        CmsPagesFormPostCreate: '投稿として設定',
        CmsPagesFormPostEdit: '投稿',
        CmsPagesFormPostHelperTextCreate:
          'このページを投稿として設定すると、日付と著者のフィールドが追加されます。',
        CmsPagesFormPostHelperTextEdit:
          'このページを投稿として設定すると、日付と著者のフィールドが追加されます。',
        CmsPagesFormPostDateCreate: '新規ページの日付を入力',
        CmsPagesFormPostDateEdit: 'ページの公開日',
        CmsPagesFormPostDateHelperTextCreate:
          '日付は投稿の並べ替えに使用されます。',
        CmsPagesFormPostDateHelperTextEdit:
          '日付は投稿の並べ替えに使用されます。',
        CmsPagesFormPostAuthorCreate: '新規ページの著者を入力',
        CmsPagesFormPostAuthorEdit: 'ページの著者',
        CmsPagesFormPostAuthorHelperTextCreate:
          '投稿の著者として表示されます。',
        CmsPagesFormPostAuthorHelperTextEdit: '投稿の著者として表示されます。',
        CmsPagesFormPostCategoryCreate: '新規ページのカテゴリーを入力',
        CmsPagesFormPostCategoryEdit: 'ページのカテゴリー',
        CmsPagesFormPostCategoryHelperTextCreate:
          'カテゴリーは投稿の分類に使用されます。',
        CmsPagesFormPostCategoryHelperTextEdit:
          'カテゴリーは投稿の分類に使用されます。',
        CmsPagesFormExcludeFromIndexCreate: 'インデックスから除外',
        CmsPagesFormExcludeFromIndexEdit: 'インデックスから除外',
        CmsPagesFormExcludeFromIndexHelperTextCreate:
          'このページをすべてのインデックスフィールド（ページが一覧表示される場所など）から除外します。',
        CmsPagesFormExcludeFromIndexHelperTextEdit:
          'このページをすべてのインデックスフィールド（ページが一覧表示される場所など）から除外します。',
        CmsPagesFormPlaceholdersTitle: 'タイトル',
        CmsPagesFormPlaceholdersSlug: 'slug',
        CmsPagesFormPlaceholdersDescription: '説明',
        CmsPagesFormPlaceholdersAuthor: '著者',
        CmsPagesFormPlaceholdersCategory: 'カテゴリー',
        CmsPagesFormHelperMediaDescription:
          '組織を表す写真をアップロードしてください。',
        CmsPagesFormErrorsSlugInUse: 'このスラッグはすでに使用されています',
        CmsPagesFormErrorsParentRequired: '親ページは必須です',
        CmsPagesFormErrorsTemplateRequired: 'テンプレートは必須です',
        CmsPagesFormErrorsDateRequired: 'ブログ投稿には日付が必須です',
        CmsPagesFormErrorsAuthorRequired: 'ブログ投稿には著者が必須です',
        CmsPagesFormButtonsPreview: 'プレビュー',
        CmsPagesFormButtonsEdit: 'ページを編集',
        CmsPagesFormButtonsCancel: 'キャンセル',
        CmsPagesFormButtonsCreate: 'ページを作成',
        CmsPagesFormButtonsSave: 'ページを保存',

        CmsMediaTitle: 'Jaen CMS | メディア',
        CmsMediaMenuLabel: 'メディア',
        CmsMediaBreadcrumbsMedia: 'メディア',

        CmsSettingsTitle: 'Jaen CMS | 設定',
        CmsSettingsMenuLabel: '設定',
        CmsSettingsBreadcrumbsSettings: '設定',
        CmsSettingsNotificationsUpdated: '設定を更新しました',
        CmsSettingsFormHeading: '設定',
        CmsSettingsFormSiteInfoGroupTitle: 'サイト情報',
        CmsSettingsFormSiteInfoTitleLabel: 'タイトル',
        CmsSettingsFormSiteInfoTitlePlaceholder: 'タイトル',
        CmsSettingsFormSiteInfoTitleTooLong: 'タイトルが長すぎます',
        CmsSettingsFormSiteInfoUrlLabel: 'URL',
        CmsSettingsFormSiteInfoUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormSiteInfoUrlInvalid:
          'URL は http:// または https:// で始まる必要があります',
        CmsSettingsFormSiteInfoDescriptionLabel: '説明',
        CmsSettingsFormSiteInfoDescriptionPlaceholder:
          '検索エンジンや SNS に表示される説明です。',
        CmsSettingsFormSiteInfoDescriptionHelper: 'サイトの簡単な説明です。',
        CmsSettingsFormSiteInfoImageLabel: '画像',
        CmsSettingsFormSiteInfoImageDescription:
          'サイトを表す写真をアップロードしてください。',
        CmsSettingsFormOrganisationGroupTitle: '組織',
        CmsSettingsFormOrganisationNameLabel: '名前',
        CmsSettingsFormOrganisationNamePlaceholder: 'Snek',
        CmsSettingsFormOrganisationNameTooLong: '名前が長すぎます',
        CmsSettingsFormOrganisationUrlLabel: 'URL',
        CmsSettingsFormOrganisationUrlPlaceholder: 'https://snek.at',
        CmsSettingsFormOrganisationUrlInvalid:
          'URL は http:// または https:// で始まる必要があります',
        CmsSettingsFormOrganisationLogoLabel: '画像',
        CmsSettingsFormOrganisationLogoDescription:
          '組織を表す写真をアップロードしてください。',
        CmsSettingsFormCancel: 'キャンセル',
        CmsSettingsFormSave: '保存',

        CmsDebugTitle: 'Jaen CMS | デバッグ',
        CmsDebugBreadcrumbsDebug: 'デバッグ',

        CmsNotificationTitle: 'Jaen CMS | 通知',
        CmsNotificationMenuLabel: 'ポップアップ',
        CmsNotificationBreadcrumbsPopup: 'ポップアップ',
        CmsNotificationCardTitle: '通知ポップアップ',
        CmsNotificationCardDescription:
          '通知ポップアップを設定します。ユーザーがページを訪れたときに通知が表示されます。',
        CmsNotificationPreview: 'プレビュー',
        CmsNotificationNotificationsUpdated: '通知を更新しました',
        CmsNotificationNotificationsUpdatedDescription: '通知が更新されました',
        CmsNotificationFormTitleLabel: 'タイトル',
        CmsNotificationFormTitlePlaceholder: 'お知らせ',
        CmsNotificationFormTitleDescription: '通知のタイトルです。',
        CmsNotificationFormMessageLabel: 'メッセージ',
        CmsNotificationFormMessageExample: 'これはサンプルメッセージです',
        CmsNotificationFormMessageDescription: '通知のメッセージです。',
        CmsNotificationFormEnterUrl: 'URL を入力してください',
        CmsNotificationFormFromLabel: '開始日',
        CmsNotificationFormFromDescription: 'この日付<b>以降</b>に通知が表示されます。',
        CmsNotificationFormToLabel: '終了日',
        CmsNotificationFormToDescription: 'この日付<b>まで</b>通知が表示されます。',
        CmsNotificationFormPickDate: '日付を選択',
        CmsNotificationFormEnabledLabel: 'ユーザーがページを訪れたときに通知ポップアップを表示する',
        CmsNotificationFormSubmit: '送信',

        // Accounts
        CmsAccountsErrorsLoadService:
          'ID サービスからユーザーを読み込めませんでした。',
        CmsAccountsErrorsLoadGeneric: 'ユーザーを読み込めませんでした。',
        CmsAccountsNotificationsCreated: 'アカウントを作成しました',
        CmsAccountsNotificationsCreatedDescription:
          'アカウント「{username}」を作成しました',
        CmsAccountsNotificationsCreateFailed:
          'アカウントを作成できませんでした',
        CmsAccountsTitle: 'アカウント',
        CmsAccountsPageTitle: 'Jaen CMS | アカウント',
        CmsAccountsMenuLabel: 'アカウント',
        CmsAccountsBreadcrumbsAccounts: 'アカウント',
        CmsAccountsSubtitle:
          'ID テナントのユーザーアカウントを閲覧・管理します。',
        CmsAccountsActionsCreate: '新規アカウント',
        CmsAccountsSearchPlaceholder: '名前、メールアドレス、ログイン名で検索',
        CmsAccountsErrorsLoadTitle: 'アカウントを読み込めません',
        CmsAccountsCardUnnamed: '名前のないユーザー',
        CmsAccountsCardNoEmail: 'メールアドレス未設定',
        CmsAccountsCardUsername: 'ユーザー名',
        CmsAccountsCardLoginNames: 'ログイン名',
        CmsAccountsCardNoLoginNames: '別のログイン名はありません',
        CmsAccountsCardManage: 'アカウントを管理',
        CmsAccountsEmptyTitle: '検索に一致するアカウントがありません',
        CmsAccountsEmptyHint:
          '検索条件を変更するか、新しいアカウントを作成してください。',
        CmsAccountsCreateTitle: '新規アカウントの作成',
        CmsAccountsCreateUsername: 'ユーザー名',
        CmsAccountsCreateEmail: 'メールアドレス',
        CmsAccountsCreateFirstName: '名',
        CmsAccountsCreateLastName: '姓',
        CmsAccountsCreateInitialPassword: '初期パスワード（任意）',
        CmsAccountsCreateSendReset:
          'パスワードが未設定の場合、パスワードリセットメールを送信する',
        CmsAccountsActionsCancel: 'キャンセル',
        CmsAccountsActionsCreateSubmit: 'アカウントを作成',
        CmsAccountsErrorsDetailService:
          'ID サービスからユーザープロフィールを読み込めませんでした。',
        CmsAccountsErrorsDetailGeneric:
          'ユーザープロフィールを読み込めませんでした。',
        CmsAccountsNotificationsActionFailed: '操作に失敗しました',
        CmsAccountsNotificationsSaved: '変更を保存しました',
        CmsAccountsNotificationsSavedDescription:
          'プロフィールを更新しました。',
        CmsAccountsNotificationsSaveFailed: '保存に失敗しました',
        CmsAccountsNotificationsDeleted: 'アカウントを削除しました',
        CmsAccountsNotificationsPasswordSet: 'パスワードを設定しました',
        CmsAccountsNotificationsRolesUpdated: 'ロールを更新しました',
        CmsAccountsDetailBack: 'アカウント一覧に戻る',
        CmsAccountsErrorsDetailTitle: 'このアカウントを読み込めません',
        CmsAccountsDetailNoEmail: 'プライマリメールアドレスが未設定です',
        CmsAccountsDetailUsername: 'ユーザー名',
        CmsAccountsDetailPreferredLogin: '優先ログイン名',
        CmsAccountsDetailState: 'アカウントの状態',
        CmsAccountsDetailCreated: '作成日時',
        CmsAccountsDetailLastChange: '最終更新日時',
        CmsAccountsDetailResourceOwner: '組織',
        CmsAccountsProfileTitle: 'プロフィール',
        CmsAccountsProfileDisplayName: '表示名',
        CmsAccountsProfileLanguage: '優先言語',
        CmsAccountsProfileFirstName: '名',
        CmsAccountsProfileLastName: '姓',
        CmsAccountsProfileEmail: 'メールアドレス',
        CmsAccountsProfilePhone: '電話番号',
        CmsAccountsProfileReset: 'リセット',
        CmsAccountsProfileSave: '変更を保存',
        CmsAccountsRolesTitle: 'プロジェクトロール',
        CmsAccountsRolesGrant: 'ロールを付与',
        CmsAccountsRolesEdit: '編集',
        CmsAccountsNotificationsRolesRevoked: 'ロールを取り消しました',
        CmsAccountsRolesRevoke: '取り消し',
        CmsAccountsRolesEmpty: '付与されたプロジェクトロールはありません。',
        CmsAccountsActionsTitle: 'アカウント操作',
        CmsAccountsActionsSetPassword: 'パスワードを設定',
        CmsAccountsNotificationsResetRequested:
          'パスワードリセットをリクエストしました',
        CmsAccountsActionsRequestReset: 'パスワードリセットをリクエスト',
        CmsAccountsNotificationsVerificationSent: '確認メールを送信しました',
        CmsAccountsActionsResendVerification: '確認メールを再送信',
        CmsAccountsNotificationsDeactivated: 'アカウントを無効化しました',
        CmsAccountsActionsDeactivate: '無効化',
        CmsAccountsNotificationsReactivated: 'アカウントを再有効化しました',
        CmsAccountsActionsReactivate: '再有効化',
        CmsAccountsNotificationsUnlocked: 'アカウントのロックを解除しました',
        CmsAccountsActionsUnlock: 'ロック解除',
        CmsAccountsNotificationsLocked: 'アカウントをロックしました',
        CmsAccountsActionsLock: 'ロック',
        CmsAccountsActionsDelete: 'アカウントを削除',
        CmsAccountsDeleteTitle: 'アカウントを削除',
        CmsAccountsDeletePrompt:
          '「{username}」を削除してもよろしいですか？この操作は元に戻せません。',
        CmsAccountsPasswordTitle: '新しいパスワードの設定',
        CmsAccountsPasswordNew: '新しいパスワード',
        CmsAccountsPasswordChangeRequired:
          '次回ログイン時にパスワードの変更を必須にする',
        CmsAccountsRolesEditTitle: '付与されたロールの編集',
        CmsAccountsRolesGrantTitle: 'プロジェクトロールの付与',
        CmsAccountsRolesProject: 'プロジェクト',
        CmsAccountsRolesNoneAvailable:
          'このプロジェクトで利用可能なロールはありません。',
        CmsAccountsRolesSave: 'ロールを保存'
      }
    }
  }

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

      CmsFrameStartEditing: 'Start editing',
      CmsFrameStopEditing: 'Stop editing',
      CmsFrameSaveDraft: 'Save draft',
      CmsFrameImportDraft: 'Import draft',
      CmsFrameDiscardChanges: 'Discard changes',
      CmsFramePublish:
        '{isPublishing, select, true {Publish in progress} other {Publish changes}}',
      CmsFrameNewMedia: 'New media',
      CmsFrameGuest: 'Guest',
      CmsFrameNotificationsEditModeTitle: 'Edit mode',
      CmsFrameNotificationsEditModeOn: 'You can now edit the page',
      CmsFrameNotificationsEditModeOff: 'You can no longer edit the page',
      CmsFrameNotificationsSaved: 'Saved',
      CmsFrameNotificationsSavedDescription: 'Your changes have been saved',
      CmsFrameNotificationsImported: 'Imported',
      CmsFrameNotificationsImportedDescription:
        'Your changes have been imported',
      CmsFrameNotificationsImportFailed: 'Failed to import',
      CmsFrameNotificationsImportFailedDescription:
        'Your changes could not be imported',
      CmsFrameNotificationsDiscarded: 'Discarded',
      CmsFrameNotificationsDiscardedDescription:
        'Your changes have been discarded',

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
      CmsNotificationBreadcrumbsPopup: 'Popup',
      CmsNotificationCardTitle: 'Notification Popup',
      CmsNotificationCardDescription:
        'Configure the notification popup. The notification will be shown when the user visits the page.',
      CmsNotificationPreview: 'Preview',
      CmsNotificationNotificationsUpdated: 'Notification updated',
      CmsNotificationNotificationsUpdatedDescription:
        'The notification has been updated',
      CmsNotificationFormTitleLabel: 'Title',
      CmsNotificationFormTitlePlaceholder: 'News',
      CmsNotificationFormTitleDescription: 'The title of the notification',
      CmsNotificationFormMessageLabel: 'Message',
      CmsNotificationFormMessageExample: 'This is a example message',
      CmsNotificationFormMessageDescription: 'The message of the notification',
      CmsNotificationFormEnterUrl: 'Enter the URL',
      CmsNotificationFormFromLabel: 'From',
      CmsNotificationFormFromDescription:
        'The notification will be shown <b>after</b> this date',
      CmsNotificationFormToLabel: 'To',
      CmsNotificationFormToDescription:
        'The notification will be shown <b>until</b> this date',
      CmsNotificationFormPickDate: 'Pick a date',
      CmsNotificationFormEnabledLabel:
        'Show notification popup when the user visits the page',
      CmsNotificationFormSubmit: 'Submit',

      // Accounts
      CmsAccountsErrorsLoadService:
        'Failed to load users from the identity service.',
      CmsAccountsErrorsLoadGeneric: 'Failed to load users.',
      CmsAccountsNotificationsCreated: 'Account created',
      CmsAccountsNotificationsCreatedDescription:
        'Account {username} has been created',
      CmsAccountsNotificationsCreateFailed: 'Could not create account',
      CmsAccountsTitle: 'Accounts',
      CmsAccountsPageTitle: 'Jaen CMS | Accounts',
      CmsAccountsMenuLabel: 'Accounts',
      CmsAccountsBreadcrumbsAccounts: 'Accounts',
      CmsAccountsSubtitle:
        'Browse and manage the user accounts of your identity tenant.',
      CmsAccountsActionsCreate: 'New account',
      CmsAccountsSearchPlaceholder: 'Search by name, email or login name',
      CmsAccountsErrorsLoadTitle: 'Unable to load accounts',
      CmsAccountsCardUnnamed: 'Unnamed user',
      CmsAccountsCardNoEmail: 'No email provided',
      CmsAccountsCardUsername: 'Username',
      CmsAccountsCardLoginNames: 'Login names',
      CmsAccountsCardNoLoginNames: 'No alternate login names',
      CmsAccountsCardManage: 'Manage account',
      CmsAccountsEmptyTitle: 'No accounts match your search',
      CmsAccountsEmptyHint: 'Adjust the search term or create a new account.',
      CmsAccountsCreateTitle: 'Create a new account',
      CmsAccountsCreateUsername: 'Username',
      CmsAccountsCreateEmail: 'Email',
      CmsAccountsCreateFirstName: 'First name',
      CmsAccountsCreateLastName: 'Last name',
      CmsAccountsCreateInitialPassword: 'Initial password (optional)',
      CmsAccountsCreateSendReset:
        'Send a password reset email when no password is set',
      CmsAccountsActionsCancel: 'Cancel',
      CmsAccountsActionsCreateSubmit: 'Create account',
      CmsAccountsErrorsDetailService:
        'Failed to load the user profile from the identity service.',
      CmsAccountsErrorsDetailGeneric: 'Failed to load the user profile.',
      CmsAccountsNotificationsActionFailed: 'Action failed',
      CmsAccountsNotificationsSaved: 'Changes saved',
      CmsAccountsNotificationsSavedDescription: 'The profile has been updated.',
      CmsAccountsNotificationsSaveFailed: 'Save failed',
      CmsAccountsNotificationsDeleted: 'Account deleted',
      CmsAccountsNotificationsPasswordSet: 'Password set',
      CmsAccountsNotificationsRolesUpdated: 'Roles updated',
      CmsAccountsDetailBack: 'Back to accounts',
      CmsAccountsErrorsDetailTitle: 'Unable to load this account',
      CmsAccountsDetailNoEmail: 'No primary email provided',
      CmsAccountsDetailUsername: 'Username',
      CmsAccountsDetailPreferredLogin: 'Preferred login',
      CmsAccountsDetailState: 'Account state',
      CmsAccountsDetailCreated: 'Created',
      CmsAccountsDetailLastChange: 'Last change',
      CmsAccountsDetailResourceOwner: 'Organization',
      CmsAccountsProfileTitle: 'Profile',
      CmsAccountsProfileDisplayName: 'Display name',
      CmsAccountsProfileLanguage: 'Preferred language',
      CmsAccountsProfileFirstName: 'First name',
      CmsAccountsProfileLastName: 'Last name',
      CmsAccountsProfileEmail: 'Email',
      CmsAccountsProfilePhone: 'Phone',
      CmsAccountsProfileReset: 'Reset',
      CmsAccountsProfileSave: 'Save changes',
      CmsAccountsRolesTitle: 'Project roles',
      CmsAccountsRolesGrant: 'Grant roles',
      CmsAccountsRolesEdit: 'Edit',
      CmsAccountsNotificationsRolesRevoked: 'Roles revoked',
      CmsAccountsRolesRevoke: 'Revoke',
      CmsAccountsRolesEmpty: 'No project roles granted.',
      CmsAccountsActionsTitle: 'Account actions',
      CmsAccountsActionsSetPassword: 'Set password',
      CmsAccountsNotificationsResetRequested: 'Password reset requested',
      CmsAccountsActionsRequestReset: 'Request password reset',
      CmsAccountsNotificationsVerificationSent: 'Verification email sent',
      CmsAccountsActionsResendVerification: 'Resend email verification',
      CmsAccountsNotificationsDeactivated: 'Account deactivated',
      CmsAccountsActionsDeactivate: 'Deactivate',
      CmsAccountsNotificationsReactivated: 'Account reactivated',
      CmsAccountsActionsReactivate: 'Reactivate',
      CmsAccountsNotificationsUnlocked: 'Account unlocked',
      CmsAccountsActionsUnlock: 'Unlock',
      CmsAccountsNotificationsLocked: 'Account locked',
      CmsAccountsActionsLock: 'Lock',
      CmsAccountsActionsDelete: 'Delete account',
      CmsAccountsDeleteTitle: 'Delete account',
      CmsAccountsDeletePrompt:
        'Are you sure you want to delete {username}? This cannot be undone.',
      CmsAccountsPasswordTitle: 'Set a new password',
      CmsAccountsPasswordNew: 'New password',
      CmsAccountsPasswordChangeRequired: 'Require a change on next sign-in',
      CmsAccountsRolesEditTitle: 'Edit granted roles',
      CmsAccountsRolesGrantTitle: 'Grant project roles',
      CmsAccountsRolesProject: 'Project',
      CmsAccountsRolesNoneAvailable: 'No roles available for this project.',
      CmsAccountsRolesSave: 'Save roles'
    }
  }
}
