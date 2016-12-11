<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateObjectActionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('object_action', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 60);
            $table->string('code', 60);
            $table->integer('module_id')->nullable()->index();
            $table->foreign('module_id')->references('id')->on('module');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('object_action');
    }
}
