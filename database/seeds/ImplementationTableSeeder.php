<?php


use Illuminate\Database\Seeder;
use Faker\Factory as FakerFactory;

class ImplementationTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $faker = FakerFactory::create();
        $data = [
            'client-a' => [
                'name' => 'Client 1',
                'identifier' => 1,
                'created_at' => $faker->date('Y-m-d H:i:s'),
                'updated_at' => $faker->date('Y-m-d H:i:s'),
            ],
            'client-b' => [
                'name' => 'Client 2',
                'identifier' => 2,
                'created_at' => $faker->date('Y-m-d H:i:s'),
                'updated_at' => $faker->date('Y-m-d H:i:s'),
            ],
            'client-c' => [
                'name' => 'Client 3',
                'identifier' => 3,
                'created_at' => $faker->date('Y-m-d H:i:s'),
                'updated_at' => $faker->date('Y-m-d H:i:s'),
            ]
        ];
        foreach ($data as $code => $item) {
            $item['code'] = $code;
            DB::table('implementation')->insert($item);
        }
    }
}
