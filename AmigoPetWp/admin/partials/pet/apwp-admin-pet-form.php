<?php
/**
 * Formulário de adição/edição de pets
 */
?>
<div class="wrap">
    <div class="apwp-form-wrapper">
        <h2 class="apwp-form-title">
            <?php echo isset($_GET['id']) ? esc_html__('Editar Pet', 'amigopet-wp') : esc_html__('Adicionar Novo Pet', 'amigopet-wp'); ?>
        </h2>
        
        <div class="apwp-messages"></div>

        <form id="pet-form" class="apwp-form">
            <?php wp_nonce_field('apwp_pet_nonce', 'apwp_pet_nonce'); ?>
            <input type="hidden" name="id" value="<?php echo isset($_GET['id']) ? esc_attr($_GET['id']) : ''; ?>">
            
            <div class="apwp-form-section">
                <h3><?php esc_html_e('Informações Básicas', 'amigopet-wp'); ?></h3>
                
                <div class="apwp-form-row">
                    <label class="apwp-form-label" for="name">
                        <?php esc_html_e('Nome', 'amigopet-wp'); ?>
                        <span class="required">*</span>
                    </label>
                    <input type="text" class="apwp-form-input" id="name" name="name" required>
                </div>

                <div class="apwp-form-row">
                    <label class="apwp-form-label" for="species_id">
                        <?php esc_html_e('Espécie', 'amigopet-wp'); ?>
                        <span class="required">*</span>
                    </label>
                    <select class="apwp-form-input" id="species_id" name="species_id" required>
                        <option value=""><?php esc_html_e('Selecione uma espécie', 'amigopet-wp'); ?></option>
                    </select>
                </div>

                <div class="apwp-form-row">
                    <label class="apwp-form-label" for="breed_id">
                        <?php esc_html_e('Raça', 'amigopet-wp'); ?>
                    </label>
                    <select class="apwp-form-input" id="breed_id" name="breed_id">
                        <option value=""><?php esc_html_e('Selecione uma raça', 'amigopet-wp'); ?></option>
                    </select>
                </div>

                <div class="apwp-form-grid">
                    <div class="apwp-form-row">
                        <label class="apwp-form-label" for="age">
                            <?php esc_html_e('Idade', 'amigopet-wp'); ?>
                        </label>
                        <input type="text" class="apwp-form-input" id="age" name="age">
                    </div>

                    <div class="apwp-form-row">
                        <label class="apwp-form-label" for="gender">
                            <?php esc_html_e('Gênero', 'amigopet-wp'); ?>
                        </label>
                        <select class="apwp-form-input" id="gender" name="gender">
                            <option value=""><?php esc_html_e('Selecione o gênero', 'amigopet-wp'); ?></option>
                            <option value="male"><?php esc_html_e('Macho', 'amigopet-wp'); ?></option>
                            <option value="female"><?php esc_html_e('Fêmea', 'amigopet-wp'); ?></option>
                        </select>
                    </div>

                    <div class="apwp-form-row">
                        <label class="apwp-form-label" for="size">
                            <?php esc_html_e('Porte', 'amigopet-wp'); ?>
                        </label>
                        <select class="apwp-form-input" id="size" name="size">
                            <option value=""><?php esc_html_e('Selecione o porte', 'amigopet-wp'); ?></option>
                            <option value="small"><?php esc_html_e('Pequeno', 'amigopet-wp'); ?></option>
                            <option value="medium"><?php esc_html_e('Médio', 'amigopet-wp'); ?></option>
                            <option value="large"><?php esc_html_e('Grande', 'amigopet-wp'); ?></option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="apwp-form-section">
                <h3><?php esc_html_e('Detalhes Adicionais', 'amigopet-wp'); ?></h3>
                
                <div class="apwp-form-row">
                    <label class="apwp-form-label" for="color">
                        <?php esc_html_e('Cor', 'amigopet-wp'); ?>
                    </label>
                    <input type="text" class="apwp-form-input" id="color" name="color">
                </div>

                <div class="apwp-form-row">
                    <label class="apwp-form-label" for="description">
                        <?php esc_html_e('Descrição', 'amigopet-wp'); ?>
                    </label>
                    <textarea class="apwp-form-input" id="description" name="description" rows="5"></textarea>
                </div>

                <div class="apwp-form-row">
                    <label class="apwp-form-label" for="photo">
                        <?php esc_html_e('Foto', 'amigopet-wp'); ?>
                    </label>
                    <input type="hidden" id="photo_url" name="photo_url">
                    <div id="photo-preview"></div>
                    <button type="button" class="button" id="upload-photo"><?php esc_html_e('Escolher Foto', 'amigopet-wp'); ?></button>
                </div>

                <div class="apwp-form-row">
                    <label class="apwp-form-label" for="status">
                        <?php esc_html_e('Status', 'amigopet-wp'); ?>
                        <span class="required">*</span>
                    </label>
                    <select class="apwp-form-input" id="status" name="status" required>
                        <option value="available"><?php esc_html_e('Disponível', 'amigopet-wp'); ?></option>
                        <option value="adopted"><?php esc_html_e('Adotado', 'amigopet-wp'); ?></option>
                        <option value="pending"><?php esc_html_e('Pendente', 'amigopet-wp'); ?></option>
                        <option value="unavailable"><?php esc_html_e('Indisponível', 'amigopet-wp'); ?></option>
                    </select>
                </div>
            </div>

            <div class="apwp-form-actions">
                <button type="submit" class="apwp-form-button">
                    <?php echo isset($_GET['id']) ? esc_html__('Atualizar Pet', 'amigopet-wp') : esc_html__('Adicionar Pet', 'amigopet-wp'); ?>
                </button>
                <a href="<?php echo esc_url(admin_url('admin.php?page=amigopet-wp-pets')); ?>" class="apwp-form-button secondary">
                    <?php esc_html_e('Cancelar', 'amigopet-wp'); ?>
                </a>
            </div>
        </form>
    </div>
</div>

<script>
jQuery(document).ready(function($) {
    // Carrega as espécies
    $.get('/wp-json/amigopet-wp/v1/species', function(species) {
        var options = '<option value=""><?php esc_html_e('Selecione uma espécie', 'amigopet-wp'); ?></option>';
        species.forEach(function(species) {
            options += '<option value="' + species.id + '">' + species.name + '</option>';
        });
        $('#species_id').html(options);
    });

    // Carrega as raças quando uma espécie é selecionada
    $('#species_id').change(function() {
        var species_id = $(this).val();
        if (species_id) {
            $.get('/wp-json/amigopet-wp/v1/breeds?species_id=' + species_id, function(breeds) {
                var options = '<option value=""><?php esc_html_e('Selecione uma raça', 'amigopet-wp'); ?></option>';
                breeds.forEach(function(breed) {
                    options += '<option value="' + breed.id + '">' + breed.name + '</option>';
                });
                $('#breed_id').html(options);
            });
        } else {
            $('#breed_id').html('<option value=""><?php esc_html_e('Selecione uma raça', 'amigopet-wp'); ?></option>');
        }
    });

    // Upload de foto
    var mediaUploader;
    $('#upload-photo').click(function(e) {
        e.preventDefault();
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }
        mediaUploader = wp.media({
            title: '<?php esc_html_e('Escolher Foto', 'amigopet-wp'); ?>',
            button: {
                text: '<?php esc_html_e('Usar esta foto', 'amigopet-wp'); ?>'
            },
            multiple: false
        });
        mediaUploader.on('select', function() {
            var attachment = mediaUploader.state().get('selection').first().toJSON();
            $('#photo_url').val(attachment.url);
            $('#photo-preview').html('<img src="' + attachment.url + '" style="max-width:200px;">');
        });
        mediaUploader.open();
    });

    // Submissão do formulário
    $('#pet-form').submit(function(e) {
        e.preventDefault();
        var data = $(this).serialize();
        var method = $('#id').val() ? 'PUT' : 'POST';
        var url = '/wp-json/amigopet-wp/v1/pets';
        if ($('#id').val()) {
            url += '/' + $('#id').val();
        }
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: function(response) {
                window.location.href = '?page=amigopet-wp-pets';
            },
            error: function(xhr) {
                alert('<?php esc_html_e('Erro ao salvar: ', 'amigopet-wp'); ?>' + xhr.responseJSON.message);
            }
        });
    });

    // Carrega os dados do pet se estiver editando
    var id = $('#id').val();
    if (id) {
        $.get('/wp-json/amigopet-wp/v1/pets/' + id, function(pet) {
            $('#name').val(pet.name);
            $('#species_id').val(pet.species_id).trigger('change');
            $('#breed_id').val(pet.breed_id);
            $('#age').val(pet.age);
            $('#gender').val(pet.gender);
            $('#size').val(pet.size);
            $('#color').val(pet.color);
            $('#description').val(pet.description);
            $('#status').val(pet.status);
            if (pet.photo_url) {
                $('#photo_url').val(pet.photo_url);
                $('#photo-preview').html('<img src="' + pet.photo_url + '" style="max-width:200px;">');
            }
        });
    }
});
</script>
