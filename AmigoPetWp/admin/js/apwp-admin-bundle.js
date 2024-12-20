(function($) {
    'use strict';

    // Função para inicializar os recursos do admin
    function initAdmin() {
        initTabs();
        initMediaUploader();
        initSettingsForm();
        initDisplaySettings();
    }

    // Inicialização das tabs
    function initTabs() {
        $('.apwp-nav-tab').on('click', function(e) {
            e.preventDefault();
            var target = $(this).data('tab');
            
            // Atualiza as tabs ativas
            $('.apwp-nav-tab').removeClass('nav-tab-active');
            $(this).addClass('nav-tab-active');
            
            // Mostra o conteúdo da tab selecionada
            $('.apwp-tab-content').hide();
            $('#' + target).show();
            
            // Atualiza a URL sem recarregar a página
            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?page=amigopet-wp&tab=' + target;
                window.history.pushState({path:newurl}, '', newurl);
            }
        });

        // Inicializa a primeira tab ou a tab da URL
        var currentTab = new URLSearchParams(window.location.search).get('tab');
        if (!currentTab) {
            currentTab = 'general';
        }
        $('.apwp-nav-tab[data-tab="' + currentTab + '"]').trigger('click');
    }

    // Inicialização do Media Uploader
    function initMediaUploader() {
        var mediaUploader;
        $('#upload_logo_button').on('click', function(e) {
            e.preventDefault();

            if (mediaUploader) {
                mediaUploader.open();
                return;
            }

            mediaUploader = wp.media({
                title: apwpI18n.chooseLogoTitle,
                button: {
                    text: apwpI18n.useThisImage
                },
                multiple: false
            });

            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                $('#logo_url').val(attachment.url);
                $('#logo_preview').attr('src', attachment.url).show();
            });

            mediaUploader.open();
        });

        // Remover logo
        $('#remove_logo_button').on('click', function(e) {
            e.preventDefault();
            $('#logo_url').val('');
            $('#logo_preview').attr('src', '').hide();
        });
    }

    // Inicialização do formulário de configurações
    function initSettingsForm() {
        $('#apwp-settings-form').on('submit', function(e) {
            e.preventDefault();
            var form = $(this);
            var submitButton = form.find('input[type="submit"]');
            
            submitButton.prop('disabled', true);
            
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'save_apwp_settings',
                    nonce: $('#apwp_settings_nonce').val(),
                    formData: form.serialize()
                },
                success: function(response) {
                    if (response.success) {
                        alert(apwpI18n.settingsSaved);
                    } else {
                        alert(apwpI18n.settingsError + ' ' + response.data.message);
                    }
                },
                error: function() {
                    alert(apwpI18n.error);
                },
                complete: function() {
                    submitButton.prop('disabled', false);
                }
            });
        });
    }

    // Inicialização das configurações de exibição
    function initDisplaySettings() {
        if ($('.apwp-color-picker').length) {
            // Inicializa os color pickers
            $('.apwp-color-picker').wpColorPicker({
                change: function(event, ui) {
                    updatePreview();
                }
            });

            // Event listeners
            $('select, input').on('change', updatePreview);
            $('.apwp-icon-select').on('change', function() {
                var newIcon = $(this).val();
                $(this).siblings('.preview-icon')
                    .removeClass()
                    .addClass('fa fa-' + newIcon + ' preview-icon');
                updatePreview();
            });

            // Inicializa o preview
            updatePreview();
        }
    }

    // Funções auxiliares para configurações de exibição
    function updatePreview() {
        var settings = getFormSettings();
        
        // Gera CSS dinâmico
        var dynamicCSS = generateDynamicCSS(settings);
        
        // Atualiza o preview
        $.ajax({
            url: prDisplaySettings.previewUrl,
            type: 'POST',
            data: {
                action: 'apwp_preview_grid',
                settings: settings,
                _ajax_nonce: prDisplaySettings.previewNonce
            },
            success: function(response) {
                if (response.success) {
                    // Atualiza o HTML do preview
                    $('#apwp-grid-preview').html(response.data.html);
                    
                    // Atualiza o CSS
                    updateDynamicCSS(dynamicCSS);
                }
            }
        });
    }

    function getFormSettings() {
        var settings = {
            grid_columns: $('[name="apwp_display_settings[grid_columns]"]').val(),
            card_style: $('[name="apwp_display_settings[card_style]"]').val(),
            show_status_icon: $('[name="apwp_display_settings[show_status_icon]"]').is(':checked'),
            status_icons: {},
            card_colors: {
                background: $('[name="apwp_display_settings[card_colors][background]"]').val(),
                text: $('[name="apwp_display_settings[card_colors][text]"]').val(),
                accent: $('[name="apwp_display_settings[card_colors][accent]"]').val()
            }
        };

        // Coleta configurações dos ícones de status
        $('.apwp-status-icon-config').each(function() {
            var status = $(this).data('status');
            settings.status_icons[status] = {
                icon: $(this).find('.apwp-icon-select').val(),
                color: $(this).find('.apwp-color-picker').val()
            };
        });

        return settings;
    }

    function generateDynamicCSS(settings) {
        var css = `
            .apwp-animal-card {
                background-color: ${settings.card_colors.background};
                color: ${settings.card_colors.text};
                border-radius: 8px;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .apwp-animal-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }

            .apwp-animal-card .apwp-animal-title {
                color: ${settings.card_colors.text};
                font-size: ${settings.typography?.title_size || '18px'};
            }

            .apwp-animal-card .apwp-status-icon {
                font-size: 1.2em;
                margin-right: 5px;
            }
        `;

        // Adiciona CSS específico para cada status
        Object.keys(settings.status_icons).forEach(status => {
            const iconData = settings.status_icons[status];
            css += `
                .apwp-animal-card.apwp-status-${status} .apwp-status-icon {
                    color: ${iconData.color};
                }
            `;
        });

        // CSS específico para cada estilo de card
        switch (settings.card_style) {
            case 'modern':
                css += `
                    .apwp-animal-card {
                        border: none;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                `;
                break;
            case 'classic':
                css += `
                    .apwp-animal-card {
                        border: 1px solid #ddd;
                        box-shadow: none;
                    }
                `;
                break;
            case 'minimal':
                css += `
                    .apwp-animal-card {
                        border: none;
                        box-shadow: none;
                        background: transparent;
                    }
                `;
                break;
        }

        return css;
    }

    function updateDynamicCSS(css) {
        let styleTag = $('#apwp-dynamic-style');
        if (!styleTag.length) {
            styleTag = $('<style id="apwp-dynamic-style"></style>').appendTo('head');
        }
        styleTag.html(css);
    }

    // Função para buscar tarefas pendentes
    function fetchPendingTasks() {
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'get_pending_tasks',
                nonce: apwp_dashboard.nonce
            },
            success: function(response) {
                if (response.success) {
                    updatePendingTasks(response.data);
                }
            }
        });
    }

    // Função para atualizar a lista de tarefas pendentes
    function updatePendingTasks(data) {
        var $adoptionsList = jQuery('.pending-adoptions-list');
        var $verificationsList = jQuery('.pending-verifications-list');
        var $followupsList = jQuery('.pending-followups-list');

        // Limpa as listas
        $adoptionsList.empty();
        $verificationsList.empty();
        $followupsList.empty();

        // Adoções pendentes
        if (data.adoptions && data.adoptions.length > 0) {
            data.adoptions.forEach(function(adoption) {
                $adoptionsList.append(
                    '<li class="pending-task">' +
                    '<a href="admin.php?page=amigopet-wp-adoption&action=edit&id=' + adoption.id + '">' +
                    '<span class="dashicons dashicons-pets"></span> ' +
                    adoption.pet_name + ' - ' + adoption.adopter_name +
                    '</a>' +
                    '</li>'
                );
            });
        } else {
            $adoptionsList.append('<li class="no-tasks">' + apwpI18n.noPendingAdoptions + '</li>');
        }

        // Verificações pendentes
        if (data.verifications && data.verifications.length > 0) {
            data.verifications.forEach(function(verification) {
                $verificationsList.append(
                    '<li class="pending-task">' +
                    '<a href="admin.php?page=amigopet-wp-adopter&action=edit&id=' + verification.adopter_id + '">' +
                    '<span class="dashicons dashicons-' + (verification.type === 'document' ? 'media-document' : 'location') + '"></span> ' +
                    verification.message +
                    '</a>' +
                    '</li>'
                );
            });
        } else {
            $verificationsList.append('<li class="no-tasks">' + apwpI18n.noPendingVerifications + '</li>');
        }

        // Acompanhamentos pendentes
        if (data.followups && data.followups.length > 0) {
            data.followups.forEach(function(followup) {
                $followupsList.append(
                    '<li class="pending-task">' +
                    '<a href="admin.php?page=amigopet-wp-adoption&action=edit&id=' + followup.adoption_id + '">' +
                    '<span class="dashicons dashicons-calendar-alt"></span> ' +
                    followup.message +
                    '</a>' +
                    '</li>'
                );
            });
        } else {
            $followupsList.append('<li class="no-tasks">' + apwpI18n.noPendingFollowups + '</li>');
        }
    }

    // Inicializa a busca de tarefas pendentes quando estiver na página do dashboard
    if (jQuery('.apwp-pending-tasks').length > 0) {
        fetchPendingTasks();
        // Atualiza a cada 5 minutos
        setInterval(fetchPendingTasks, 300000);
    }

    // Função para atualizar as atividades pendentes
    function updatePendingActivities() {
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'apwp_get_pending_activities',
                nonce: apwpAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    updatePendingTasks(response.data);
                } else {
                    console.error('Erro ao carregar atividades pendentes:', response.data.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro na requisição AJAX:', error);
            }
        });
    }

    // Função para atualizar a lista de tarefas pendentes
    function updatePendingTasks(data) {
        var $adoptionsList = jQuery('.pending-adoptions-list');
        var $verificationsList = jQuery('.pending-verifications-list');
        var $followupsList = jQuery('.pending-followups-list');

        // Limpa as listas
        $adoptionsList.empty();
        $verificationsList.empty();
        $followupsList.empty();

        // Adoções pendentes
        if (data.adoptions && data.adoptions.length > 0) {
            data.adoptions.forEach(function(adoption) {
                $adoptionsList.append(
                    '<li>' +
                    '<div class="activity-info">' +
                    '<span class="dashicons dashicons-pets"></span> ' +
                    adoption.pet_name + ' - ' + adoption.adopter_name +
                    '</div>' +
                    '<div class="activity-actions">' +
                    '<button class="button button-small approve-adoption" data-id="' + adoption.id + '">' +
                    '<span class="dashicons dashicons-yes"></span>' +
                    '</button>' +
                    '<button class="button button-small reject-adoption" data-id="' + adoption.id + '">' +
                    '<span class="dashicons dashicons-no"></span>' +
                    '</button>' +
                    '</div>' +
                    '</li>'
                );
            });
        } else {
            $adoptionsList.append('<li>' + apwpI18n.noPendingAdoptions + '</li>');
        }

        // Verificações pendentes
        if (data.verifications && data.verifications.length > 0) {
            data.verifications.forEach(function(verification) {
                $verificationsList.append(
                    '<li>' +
                    '<div class="activity-info">' +
                    '<span class="dashicons dashicons-' + (verification.type === 'document' ? 'media-document' : 'location') + '"></span> ' +
                    verification.message +
                    '</div>' +
                    '<div class="activity-actions">' +
                    '<button class="button button-small review-verification" data-id="' + verification.id + '">' +
                    '<span class="dashicons dashicons-visibility"></span>' +
                    '</button>' +
                    '</div>' +
                    '</li>'
                );
            });
        } else {
            $verificationsList.append('<li>' + apwpI18n.noPendingVerifications + '</li>');
        }

        // Acompanhamentos pendentes
        if (data.followups && data.followups.length > 0) {
            data.followups.forEach(function(followup) {
                $followupsList.append(
                    '<li>' +
                    '<div class="activity-info">' +
                    '<span class="dashicons dashicons-calendar-alt"></span> ' +
                    followup.message +
                    '</div>' +
                    '<div class="activity-actions">' +
                    '<button class="button button-small complete-followup" data-id="' + followup.id + '">' +
                    '<span class="dashicons dashicons-yes"></span>' +
                    '</button>' +
                    '</div>' +
                    '</li>'
                );
            });
        } else {
            $followupsList.append('<li>' + apwpI18n.noPendingFollowups + '</li>');
        }
    }

    // Atualiza as atividades a cada 5 minutos
    setInterval(updatePendingActivities, 5 * 60 * 1000);

    // Carrega as atividades quando a página é carregada
    jQuery(document).ready(function($) {
        updatePendingActivities();

        // Event handlers para os botões de ação
        $(document).on('click', '.approve-adoption', function() {
            var adoptionId = $(this).data('id');
            handleAdoptionAction(adoptionId, 'approve');
        });

        $(document).on('click', '.reject-adoption', function() {
            var adoptionId = $(this).data('id');
            handleAdoptionAction(adoptionId, 'reject');
        });

        $(document).on('click', '.review-verification', function() {
            var verificationId = $(this).data('id');
            handleVerificationReview(verificationId);
        });

        $(document).on('click', '.complete-followup', function() {
            var followupId = $(this).data('id');
            handleFollowupComplete(followupId);
        });
    });

    // Funções para lidar com as ações
    function handleAdoptionAction(adoptionId, action) {
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'apwp_handle_adoption_action',
                adoption_id: adoptionId,
                adoption_action: action,
                nonce: apwpAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    updatePendingActivities();
                } else {
                    alert(response.data.message);
                }
            }
        });
    }

    function handleVerificationReview(verificationId) {
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'apwp_handle_verification_review',
                verification_id: verificationId,
                nonce: apwpAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    updatePendingActivities();
                } else {
                    alert(response.data.message);
                }
            }
        });
    }

    function handleFollowupComplete(followupId) {
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'apwp_handle_followup_complete',
                followup_id: followupId,
                nonce: apwpAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    updatePendingActivities();
                } else {
                    alert(response.data.message);
                }
            }
        });
    }

    // Inicializa quando o documento estiver pronto
    $(document).ready(function() {
        initAdmin();
    });

})(jQuery);
